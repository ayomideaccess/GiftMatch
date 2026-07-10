import express from 'express';
const router = express.Router();

import { protect } from '../middleware/auth.middleware.js';
import { identifyParticipant, makePick, viewResults } from '../controller/pick.controller.js';

router.post('/:eventId/identify', identifyParticipant);
router.post('/:eventId/pick', makePick);
router.get('/:eventId/results',protect, viewResults);

export default router;