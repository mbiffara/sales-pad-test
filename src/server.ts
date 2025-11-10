import http from 'http';
import app from './app';
import { config } from './config/env';

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`sales-pad-api listening on port ${config.port} in ${config.env} mode`);
});
