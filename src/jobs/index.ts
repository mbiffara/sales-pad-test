import PgBoss from 'pg-boss';

import {
  registerSendLeadMessageWorker,
  SEND_LEAD_MESSAGE_JOB,
} from './sendLeadMessageJob';
import {
  LEAD_REPLY_MESSAGE_JOB,
  registerLeadReplyWorker,
} from './leadReplyJob';

export const registerJobs = async (boss: PgBoss) => {
  await ensureQueues(boss);
  registerSendLeadMessageWorker(boss);
  registerLeadReplyWorker(boss);
};

const ensureQueues = async (boss: PgBoss) => {
  const queues = [SEND_LEAD_MESSAGE_JOB, LEAD_REPLY_MESSAGE_JOB];
  for (const queue of queues) {
    await boss.createQueue(queue);
  }
};

export * from './sendLeadMessageProducer';
export * from './leadReplyProducer';
