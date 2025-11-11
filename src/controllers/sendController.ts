import { Request, Response } from 'express';

import { enqueueSendLeadMessage } from '../jobs';
import { getLeadById } from '../services/leadService';

const cleanString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const postSend = async (req: Request, res: Response) => {
  const leadIdRaw = req.body?.leadId ?? req.body?.lead_id;
  const leadId = Number(leadIdRaw);
  const subject = cleanString(req.body?.subject);
  const body = cleanString(req.body?.body);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    return res.status(400).json({ message: 'leadId must be a positive integer.' });
  }

  if (!subject) {
    return res.status(400).json({ message: 'Subject is required.' });
  }

  if (!body) {
    return res.status(400).json({ message: 'Body is required.' });
  }

  const lead = await getLeadById(leadId);
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found.' });
  }

  if (!lead.email) {
    return res.status(400).json({ message: 'Lead does not have an email address.' });
  }

  try {
    const jobId = await enqueueSendLeadMessage({
      leadId,
      subject,
      body,
    });

    console.log(`Enqueued sendLeadMessage job ${jobId} for lead ${lead.id}`);

    return res
      .status(202)
      .json({ message: 'Send job enqueued.', jobId, leadId: lead.id });
  } catch (error) {
    console.error('Failed to enqueue send job', error);
    return res.status(500).json({ message: 'Failed to enqueue send job.' });
  }
};
