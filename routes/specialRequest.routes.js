import express from 'express';
import { sendSpecialRequest } from '../controller/specialRequest.controller.js';
import validate from '../middleware/validate.js';
import { requestSchema } from '../validators/special-request.validator.js';

const router = express.Router();

/**
 * @swagger
 * /api/special-requests/{eventId}/request:
 *   post:
 *     summary: Send a special gift request
 *     description: Allows a participant to send a special gift request to the event organizer.
 *     tags:
 *       - Special Requests
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
 *             required:
 *               - name
 *               - emailAdd
 *               - phone
 *               - wantToGift
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               emailAdd:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *                 example: "08012345678"
 *               wantToGift:
 *                 type: string
 *                 example: Books
 *               description:
 *                 type: string
 *                 example: I'd really appreciate receiving books on software engineering.
 *     responses:
 *       201:
 *         description: Special request sent successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.post('/:eventId/request', validate(requestSchema), sendSpecialRequest);

export default router;