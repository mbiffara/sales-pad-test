import PgBoss from 'pg-boss';

import { registerSendLeadMessageWorker } from './sendLeadMessageJob';

export const registerJobs = (boss: PgBoss) => {
  registerSendLeadMessageWorker(boss);
};

export * from './sendLeadMessageProducer';
