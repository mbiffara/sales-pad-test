import { Router } from 'express';

import { postReply } from '../../controllers/replyController';

const replyRoutes = Router();

replyRoutes.post('/reply', postReply);

export default replyRoutes;
