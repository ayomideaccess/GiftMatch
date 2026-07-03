import express from 'express';

const router = express.Router();

// Importing authentication controller functions
import { registerUser, verifyOTP, loginUser, logoutUser, forgottenPassword, resetPassword } from '../controller/auth.controller.js';

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgotpassword', forgottenPassword);
router.post('/reset', resetPassword);

export default router;