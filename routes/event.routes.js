import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controller/event.controller.js';
import { createEventSchema } from '../validators/event.validator.js';

const router = express.Router();

router.post('/create', protect, validate(createEventSchema), createEvent);
router.get('/',protect, getAllEvents);
router.get('/:id', getEventById);
router.put('/:id',protect, updateEvent);
router.delete('/:id',protect, deleteEvent);

export default router;