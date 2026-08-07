import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controller/event.controller.js';
import { createEventSchema } from '../validators/event.validator.js';

const router = express.Router();

/**
 * @swagger
 * /api/event/create:
 *   post:
 *     summary: Create a new gift exchange event
 *     description: Creates a new gift exchange event for authenticated users.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/create', protect, validate(createEventSchema), createEvent);

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: Get all events
 *     description: Returns all events created by the authenticated user.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/',protect, getAllEvents);

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieves a specific event using its ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /api/event/{id}:
 *   put:
 *     summary: Update an event
 *     description: Updates an existing event.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []  
 *     requestBody:     
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id',protect, updateEvent);

/**
 * @swagger
 * /api/event/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an existing event.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id',protect, deleteEvent);

export default router;