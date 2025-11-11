import PgBoss from 'pg-boss';

import {
  registerSendLeadMessageWorker,
  SEND_LEAD_MESSAGE_JOB,
} from './sendLeadMessageJob';

export const registerJobs = async (boss: PgBoss) => {
  await ensureQueues(boss);
  registerSendLeadMessageWorker(boss);
};

const ensureQueues = async (boss: PgBoss) => {
  await boss.createQueue(SEND_LEAD_MESSAGE_JOB);
};

export * from './sendLeadMessageProducer';
