import express from 'express';
import { sendSpecialRequest } from '../controller/specialRequest.controller.js';

const router = express.Router();

router.post('/:eventId/request', sendSpecialRequest);

export default router;