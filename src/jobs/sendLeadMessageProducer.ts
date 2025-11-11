import { startBoss } from '../workers/boss';
import {
  SEND_LEAD_MESSAGE_JOB,
  SendLeadMessagePayload,
} from './sendLeadMessageJob';

export const enqueueSendLeadMessage = async (payload: SendLeadMessagePayload) => {
  const boss = await startBoss();
  const jobId = await boss.send(SEND_LEAD_MESSAGE_JOB, payload);

  if (!jobId) {
    throw new Error('Failed to enqueue send-lead-message job.');
  }

  return jobId;
};
