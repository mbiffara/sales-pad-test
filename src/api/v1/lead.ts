import { Router } from 'express';

import { getLead, postLead } from '../../controllers/leadController';

const leadRoutes = Router();

leadRoutes.get('/lead/:id', getLead);
leadRoutes.post('/lead', postLead);

export default leadRoutes;
