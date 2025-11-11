import { Router } from 'express';

import { postSend } from '../../controllers/sendController';

const sendRoutes = Router();

sendRoutes.post('/send', postSend);

export default sendRoutes;
