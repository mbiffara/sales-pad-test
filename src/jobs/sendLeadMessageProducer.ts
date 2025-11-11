import { startBoss } from '../workers/boss';
import {
  SEND_LEAD_MESSAGE_JOB,
  SendLeadMessagePayload,
} from './sendLeadMessageJob';
import { recordJob } from '../services/jobService';
import type { Job } from '../db/schema';

type EnqueueSendLeadMessageOptions = {
  type?: Job['type'];
};

export const enqueueSendLeadMessage = async (
  payload: SendLeadMessagePayload,
  options: EnqueueSendLeadMessageOptions = {},
) => {
  const boss = await startBoss();
  const jobId = await boss.send(SEND_LEAD_MESSAGE_JOB, payload);

  if (!jobId) {
    throw new Error('Failed to enqueue send-lead-message job.');
  }

  await recordJob({
    bossJobId: jobId,
    leadId: payload.leadId,
    messageId: payload.messageId,
    type: options.type ?? 'send_lead_message',
  });

  return jobId;
};
