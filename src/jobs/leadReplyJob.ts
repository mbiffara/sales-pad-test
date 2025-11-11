import PgBoss from 'pg-boss';

import { createLeadReplyMessage } from '../services/messageService';
import { getLeadByEmail } from '../services/leadService';

export const LEAD_REPLY_MESSAGE_JOB = 'lead-reply-message';

export type LeadReplyJobPayload = {
  email: string;
  body: string;
  subject?: string;
};

export const registerLeadReplyWorker = (boss: PgBoss) => {
  boss.work<LeadReplyJobPayload>(LEAD_REPLY_MESSAGE_JOB, async (jobOrJobs) => {
    const jobs = Array.isArray(jobOrJobs) ? jobOrJobs : [jobOrJobs];
    for (const job of jobs) {
      await handleJob(job);
    }
  });
};

const handleJob = async (job: PgBoss.Job<LeadReplyJobPayload>) => {
  const email = job.data.email?.trim().toLowerCase();
  const body = job.data.body?.trim();
  const subject = job.data.subject?.trim() || 'Lead reply';

  if (!email) {
    console.warn('[leadReplyJob] Missing email in job payload.');
    return;
  }

  if (!body) {
    console.warn('[leadReplyJob] Missing body in job payload.');
    return;
  }

  const lead = await getLeadByEmail(email);
  if (!lead) {
    console.warn(`[leadReplyJob] No lead found for email ${email}; skipping.`);
    return;
  }

  await createLeadReplyMessage({
    leadId: lead.id,
    subject,
    body,
    channel: 'email',
  });
};
