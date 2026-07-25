import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOTPEmail, sendLoginEmail, sendPasswordResetEmail } from '../services/email.service.js';
import { generateOTP } from '../services/otp.service.js'; 
import Admin from '../models/adminModel.js';
import generateToken from '../utils/generateToken.js';
import AppError from '../utils/AppError.js';

const registerUser = async (req, res) => {
    const { firstName, lastName, email, phoneNo, password } = req.body;

    const existingAdmin = await Admin.findOne({email});
    if(existingAdmin){
        throw new AppError("Admin already exists",409);
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); //10 minutes

    //save admin

    const admin = await Admin.create({
        firstName,
        lastName,
        email,
        phoneNo,
        password: hashedPassword,
        otp,
        otpExpiry: otpExpires,
        isVerified: false
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({message: "Admin registered successfully. Check your email for OTP."});
};

//VERIFY OTP
const verifyOTP = async(req, res) => {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({email});
    if (!admin){
        throw new AppError("Admin not found",404);
    }

    if (admin.otp !== otp){
        throw new AppError("Invalid OTP",400);
    }

    if (admin.otpExpiry < new Date()){
        throw new AppError("OTP expired",400);
    }

    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    admin.save();

    res.status(200).json({message: "Email verified successfully. You can now log in."});
}

const loginUser = async(req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({email});

    if(!admin){
        throw new AppError("Admin not found",404);
    }
    if(!admin.isVerified){
        throw new AppError("Email not verified",400);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch){
        throw new AppError("Invalid credentials",400);
    }

    const token = generateToken(admin._id);

    await sendLoginEmail(email, admin.firstName);
    res.status(200).json({message: "Login successful", token});
}

const logoutUser = async(req, res) => {
    res.status(200).json({message: "Logout successful"});
}

const forgottenPassword = async(req,res) => {
    const { email } = req.body;

    const admin = await Admin.findOne({email});
    if (!admin) {
        throw new AppError("Admin not found",404);
    }
    
    const passwordResetOTP = generateOTP();
    const passResetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); //10 minutes

    await admin.updateOne({
        $set:{
            passwordResetOTP,
            passwordResetOTPExpiry: passResetOTPExpires
        }
    });

    await sendPasswordResetEmail(email, passwordResetOTP);
    res.status(200).json({message: "Password reset email sent. Check your email for OTP."});
}

const resetPassword = async(req, res) => {
    const { email, passwordResetOTP, newPassword } = req.body;

    const admin = await Admin.findOne({email});
    if (!admin) {
        throw new AppError("Admin not found",404);
    }

    if (admin.passwordResetOTP !== passwordResetOTP){
        throw new AppError("Invalid OTP",400);
    }

    if (admin.passwordResetOTPExpiry < new Date()){
        throw new AppError("OTP expired",400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.passwordResetOTP = undefined;
    admin.passwordResetOTPExpiry = undefined;
    await admin.save();

    res.status(200).json({message: "Password reset successful"});
}

const resendOTP = async(req,res) => {
    const { email } = req.body;

    const admin = await Admin.findOne({email});
    if (!admin) {
        throw new AppError("Admin not found",404);
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); //10 minutes
    await admin.save();

    await sendOTPEmail(email,otp);
    res.status(200).json({ message: "Check your email for OTP" });
}

export { registerUser, forgottenPassword, verifyOTP, loginUser, logoutUser, resetPassword, resendOTP };