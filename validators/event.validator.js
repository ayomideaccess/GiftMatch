import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string().trim().min(3),
    description: z.string().trim().min(10).optional(),
    participants: z.string().nonempty("Participants are required"),
    startDate: z.string(),
    deadline: z.string()
})