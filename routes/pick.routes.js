import express from 'express';
const router = express.Router();

import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import { identifyParticipant, makePick, viewResults } from '../controller/pick.controller.js';
import { identifySchema, makePickSchema } from '../validators/pick.validator.js';

/**
 * @swagger
 * /api/pick/{eventId}/identify:
 *   post:
 *     summary: Identify a participant
 *     description: Checks whether a participant belongs to the specified event.
 *     tags:
 *       - Picks
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Participant identified successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Participant not found
 */
router.post('/:eventId/identify', validate(identifySchema), identifyParticipant);

/**
 * @swagger
 * /api/pick/{eventId}/pick:
 *   post:
 *     summary: Make a Secret Santa pick
 *     description: Allows a participant to pick their assigned Secret Santa recipient.
 *     tags:
 *       - Picks
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pick completed successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Event or participant not found
 */
router.post('/:eventId/pick', validate(makePickSchema), makePick);

/**
 * @swagger
 * /api/pick/{eventId}/results:
 *   get:
 *     summary: View Secret Santa results
 *     description: Returns the Secret Santa results for an event.
 *     tags:
 *       - Picks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Results retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.get('/:eventId/results',protect, viewResults);

export default router;