import { email, z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().trim().min(3, "Name must be at least 3 letters"),
    lastName: z.string().trim().min(3, "Name must be at least 3 letters"),
    email: z.string().trim().email(),
    phoneNo: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export const verifyOtpSchema = z.object({
    email: z.string().trim().email(),
    otp: z.string().length(6, "OTP must contain 6 characters")
});

export const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().nonempty("Password is required")
});

export const forgottenPasswordSchema = z.object({
    email: z.string().trim().email()
});

export const resetPasswordSchema = z.object({
    email: z.string().trim().email(),
    passwordResetOTP: z.string().length(6, "OTP must contain 6 characters"),
    newPassword: z.string().min(8,"Password must be at least 8 characters")
})

export const resendOTPSchema = z.object({
    email: z.string().trim().email()
});