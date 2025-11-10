import { Router } from 'express';
import healthRouter from './healthRoutes';

const apiRouter = Router();

apiRouter.use('/v1', healthRouter);

export default apiRouter;
