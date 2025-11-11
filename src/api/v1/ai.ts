import { Router } from 'express';

import { postAIReply } from '../../controllers/aiController';

const aiRoutes = Router();

aiRoutes.post('/ai/reply', postAIReply);

export default aiRoutes;
