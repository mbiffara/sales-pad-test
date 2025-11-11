import { Request, Response } from 'express';

import { enqueueSendLeadMessage } from '../jobs';
import { generateResponse } from '../services/aiService';
import { getLeadById } from '../services/leadService';
import {
  createSystemMessage,
  listMessagesByLeadId,
} from '../services/messageService';

const cleanString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const postAIReply = async (req: Request, res: Response) => {
  const leadId = Number(req.body?.leadId ?? req.body?.lead_id);
  const subjectOverride = cleanString(req.body?.subject);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    return res.status(400).json({ message: 'leadId must be a positive integer.' });
  }

  const lead = await getLeadById(leadId);
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found.' });
  }

  if (!lead.email) {
    return res.status(400).json({ message: 'Lead does not have an email address.' });
  }

  const history = await listMessagesByLeadId(lead.id);
  const historyBodies = history.map((message) => `${message.sentBy}: ${message.body}`);

  const aiResponse = generateResponse(historyBodies);
  const subject =
    subjectOverride ??
    (history.length > 0
      ? `Re: ${history[history.length - 1].subject ?? 'your message'}`
      : `Re: ${lead.name}`);

  try {
    const message = await createSystemMessage({
      leadId: lead.id,
      subject,
      body: aiResponse,
      channel: 'email',
    });

    const jobId = await enqueueSendLeadMessage(
      {
        leadId: lead.id,
        subject,
        body: aiResponse,
        messageId: message.id,
      },
      { type: 'ai_reply_message' },
    );

    return res.status(202).json({
      message: 'AI reply enqueued.',
      jobId,
      leadId: lead.id,
      aiResponse,
      messageId: message.id,
    });
  } catch (error) {
    console.error('Failed to enqueue AI reply', error);
    return res.status(500).json({ message: 'Failed to enqueue AI reply.' });
  }
};
