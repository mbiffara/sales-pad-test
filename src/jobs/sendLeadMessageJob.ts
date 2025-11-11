import PgBoss from 'pg-boss';

import { createSystemMessage, markMessageSent } from '../services/messageService';
import { getLeadById } from '../services/leadService';
import { sendEmail } from '../services/emailService';

export const SEND_LEAD_MESSAGE_JOB = 'send-lead-message';

export type SendLeadMessagePayload = {
  leadId: number;
  subject: string;
  body: string;
};

type JobOrJobs<T> = PgBoss.Job<T> | PgBoss.Job<T>[];

export const registerSendLeadMessageWorker = (boss: PgBoss) => {
  boss.work<SendLeadMessagePayload>(SEND_LEAD_MESSAGE_JOB, async (jobOrJobs) => {
    const jobs = Array.isArray(jobOrJobs) ? jobOrJobs : [jobOrJobs];
    for (const job of jobs) {
      await handleJob(job);
    }
  });
};

const handleJob = async (job: PgBoss.Job<SendLeadMessagePayload>) => {
  const { leadId, subject, body } = job.data;

  const lead = await getLeadById(leadId);
  if (!lead) {
    console.warn(`[sendLeadMessageJob] Lead ${leadId} not found; skipping.`);
    return;
  }

  if (!lead.email) {
    console.warn(
      `[sendLeadMessageJob] Lead ${leadId} missing email address; skipping.`,
    );
    return;
  }

  const message = await createSystemMessage({
    leadId,
    subject,
    body,
    channel: 'email',
  });

  await sendEmail({
    to: lead.email,
    subject,
    body,
  });

  await markMessageSent(message.id);
};
