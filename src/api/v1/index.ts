import { Router } from 'express';

import healthRoutes from './health';
import leadRoutes from './lead';
import sendRoutes from './send';

const v1Router = Router();

v1Router.use(healthRoutes);
v1Router.use(leadRoutes);
v1Router.use(sendRoutes);

export default v1Router;
