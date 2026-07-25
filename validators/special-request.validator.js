import { z } from 'zod';

export const requestSchema = z.object({
    name: z.string().trim().min(3,"Name must be at least 3 letters"),
    emailAdd: z.string().trim().email(),
    phone: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"),
    wantToGift: z.string().trim().min(3,"Name must be at least 3 letters"),
    description: z.string().trim().min(3)
})