import { z } from 'zod';

export const identifySchema = z.object({
    pickerName: z.string().trim().min(3)
})

export const makePickSchema = z.object({
    pickerName: z.string().trim().min(3),
    pickedParticipant: z.string().trim().min(3),
    pickerName: z.string().trim().min(3)
})