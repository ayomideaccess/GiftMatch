import express from 'express';
import { sendSpecialRequest } from '../controller/specialRequest.controller.js';
import validate from '../middleware/validate.js';
import { requestSchema } from '../validators/special-request.validator.js';

const router = express.Router();

router.post('/:eventId/request', validate(requestSchema), sendSpecialRequest);

export default router;