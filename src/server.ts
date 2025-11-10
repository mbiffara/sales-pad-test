import http from 'http';

import app from './app';
import { config } from './config/env';
import { startBoss } from './workers/boss';

const server = http.createServer(app);

const start = async () => {
  try {
    await startBoss();

    server.listen(config.port, () => {
      console.log(
        `sales-pad-api listening on port ${config.port} in ${config.env} mode`,
      );
    });
  } catch (error) {
    console.error('Failed to start services', error);
    process.exit(1);
  }
};

start();
