import PgBoss from 'pg-boss';

import { createSystemMessage, markMessageSent } from '../services/messageService';
import { getLeadById } from '../services/leadService';
import { sendEmail } from '../services/emailService';
import { updateJobStatus } from '../services/jobService';
import { recordEvent } from '../services/eventService';

export const SEND_LEAD_MESSAGE_JOB = 'send-lead-message';

export type SendLeadMessagePayload = {
  leadId: number;
  subject: string;
  body: string;
  messageId?: number;
};

export const registerSendLeadMessageWorker = (boss: PgBoss) => {
  boss.work<SendLeadMessagePayload>(SEND_LEAD_MESSAGE_JOB, async (jobOrJobs) => {
    const jobs = Array.isArray(jobOrJobs) ? jobOrJobs : [jobOrJobs];
    for (const job of jobs) {
      await handleJob(job);
    }
  });
};

const handleJob = async (job: PgBoss.Job<SendLeadMessagePayload>) => {
  const { leadId, subject, body, messageId } = job.data;

  await updateJobStatus(job.id, 'processing');

  const lead = await getLeadById(leadId);
  if (!lead) {
    console.warn(`[sendLeadMessageJob] Lead ${leadId} not found; skipping.`);
    await updateJobStatus(job.id, 'skipped', {
      details: `Lead ${leadId} not found`,
    });
    return;
  }

  await updateJobStatus(job.id, 'processing', { leadId: lead.id });

  if (!lead.email) {
    console.warn(
      `[sendLeadMessageJob] Lead ${leadId} missing email address; skipping.`,
    );
    await updateJobStatus(job.id, 'skipped', {
      details: `Lead ${leadId} missing email`,
    });
    return;
  }

  try {
    let finalMessageId = messageId;

    if (!finalMessageId) {
      const message = await createSystemMessage({
        leadId,
        subject,
        body,
        channel: 'email',
      });
      finalMessageId = message.id;
    }

    await updateJobStatus(job.id, 'processing', { messageId: finalMessageId });

    await sendEmail({
      to: lead.email,
      subject,
      body,
    });

    if (finalMessageId) {
      await markMessageSent(finalMessageId);
    }

    await updateJobStatus(job.id, 'completed', { messageId: finalMessageId });
    if (finalMessageId) {
      await recordEvent({
        leadId: lead.id,
        type: 'message_sent',
        data: { messageId: finalMessageId, subject },
      });
    }
  } catch (error) {
    console.error(`[sendLeadMessageJob] Failed for job ${job.id}`, error);
    await updateJobStatus(job.id, 'failed', {
      details: error instanceof Error ? error.message : 'Unknown error',
      leadId: lead.id,
    });
  }
};
