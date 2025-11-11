import { Router } from 'express';

import aiRoutes from './ai';
import healthRoutes from './health';
import leadRoutes from './lead';
import replyRoutes from './reply';
import sendRoutes from './send';

const v1Router = Router();

v1Router.use(healthRoutes);
v1Router.use(leadRoutes);
v1Router.use(sendRoutes);
v1Router.use(replyRoutes);
v1Router.use(aiRoutes);

export default v1Router;
