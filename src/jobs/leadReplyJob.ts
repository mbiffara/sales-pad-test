import PgBoss from 'pg-boss';

import { createLeadReplyMessage } from '../services/messageService';
import { getLeadByEmail } from '../services/leadService';
import { updateJobStatus } from '../services/jobService';

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

  await updateJobStatus(job.id, 'processing');

  if (!email) {
    console.warn('[leadReplyJob] Missing email in job payload.');
    await updateJobStatus(job.id, 'failed', { details: 'Missing email' });
    return;
  }

  if (!body) {
    console.warn('[leadReplyJob] Missing body in job payload.');
    await updateJobStatus(job.id, 'failed', { details: 'Missing body' });
    return;
  }

  const lead = await getLeadByEmail(email);
  if (!lead) {
    console.warn(`[leadReplyJob] No lead found for email ${email}; skipping.`);
    await updateJobStatus(job.id, 'skipped', {
      details: `Lead not found for ${email}`,
    });
    return;
  }

  try {
    await updateJobStatus(job.id, 'processing', { leadId: lead.id });

    const message = await createLeadReplyMessage({
      leadId: lead.id,
      subject,
      body,
      channel: 'email',
    });

    await updateJobStatus(job.id, 'completed', {
      messageId: message.id,
      leadId: lead.id,
    });
  } catch (error) {
    console.error('[leadReplyJob] Failed to record reply', error);
    await updateJobStatus(job.id, 'failed', {
      details: error instanceof Error ? error.message : 'Unknown error',
      leadId: lead.id,
    });
  }
};
