import { startBoss } from '../workers/boss';
import {
  LEAD_REPLY_MESSAGE_JOB,
  LeadReplyJobPayload,
} from './leadReplyJob';

export const enqueueLeadReply = async (payload: LeadReplyJobPayload) => {
  const boss = await startBoss();
  const jobId = await boss.send(LEAD_REPLY_MESSAGE_JOB, payload);

  if (!jobId) {
    throw new Error('Failed to enqueue lead-reply-message job.');
  }

  return jobId;
};
