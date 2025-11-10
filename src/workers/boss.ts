import PgBoss from 'pg-boss';

import { config } from '../config/env';

const boss = new PgBoss({
  connectionString: config.boss.connectionString,
});

boss.on('error', (error) => {
  console.error('[pg-boss] error', error);
});

let started = false;

export const startBoss = async () => {
  if (!started) {
    await boss.start();
    started = true;
    console.log('[pg-boss] started');
  }

  return boss;
};

export const stopBoss = async () => {
  if (started) {
    await boss.stop();
    started = false;
    console.log('[pg-boss] stopped');
  }
};

export default boss;
