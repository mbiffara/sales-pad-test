import { Router } from 'express';

import healthRoutes from './health';
import leadRoutes from './lead';

const v1Router = Router();

v1Router.use(healthRoutes);
v1Router.use(leadRoutes);

export default v1Router;
