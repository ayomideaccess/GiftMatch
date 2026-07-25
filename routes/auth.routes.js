import express from 'express';

const router = express.Router();

// Importing authentication controller functions
import { registerUser, verifyOTP, loginUser, logoutUser, forgottenPassword, resetPassword, resendOTP } from '../controller/auth.controller.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema, verifyOtpSchema, forgottenPasswordSchema,resetPasswordSchema, resendOTPSchema  } from '../validators/auth.validator.js';

router.post('/register', validate(registerSchema), registerUser);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOTP);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/forgotpassword', validate(forgottenPasswordSchema), forgottenPassword);
router.post('/reset', validate(resetPasswordSchema), resetPassword);
router.post('/resend', validate(resendOTPSchema), resendOTP);

export default router;