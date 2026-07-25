import express from 'express';
const router = express.Router();

import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import { identifyParticipant, makePick, viewResults } from '../controller/pick.controller.js';
import { identifySchema, makePickSchema } from '../validators/pick.validator.js';

router.post('/:eventId/identify', validate(identifySchema), identifyParticipant);
router.post('/:eventId/pick', validate(makePickSchema), makePick);
router.get('/:eventId/results',protect, viewResults);

export default router;