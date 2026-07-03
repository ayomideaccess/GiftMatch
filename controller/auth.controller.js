import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOTPEmail, sendLoginEmail, sendPasswordResetEmail } from '../services/email.service.js';
import { generateOTP } from '../services/otp.service.js'; 
import Admin from '../models/adminModel.js';
import generateToken from '../utils/generateToken.js';

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNo, password } = req.body;

        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({message: "Admin with this email already exists"});
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
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

//VERIFY OTP
const verifyOTP = async(req, res) => {
    try{
        const { email, otp } = req.body;

        const admin = await Admin.findOne({email});
        if (!admin){
            return res.status(400).json({message: "Admin not found"});
        }

        if (admin.otp !== otp){
            return res.status(400).json({message: "Invalid OTP"});
        }

        if (admin.otpExpiry < new Date()){
            return res.status(400).json({message: "OTP has expired"});
        }

        admin.isVerified = true;
        admin.otp = undefined;
        admin.otpExpiry = undefined;
        admin.save();

        res.status(200).json({message: "Email verified successfully. You can now log in."});
    } catch(error){
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({email});

        if(!admin){
            return res.status(400).json({message: "Admin not found"});
        }
        if(!admin.isVerified){
            return res.status(400).json({message: "Email not verified. Please verify your email first."});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = generateToken(admin._id);

        await sendLoginEmail(email, admin.firstName);
        res.status(200).json({message: "Login successful", token});

    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const logoutUser = async(req, res) => {
    try {
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const forgottenPassword = async(req,res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({email});
        if (!admin) {
            return res.status(400).json({message: "Admin not found"});
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
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const resetPassword = async(req, res) => {
    try {
        const { email, passwordResetOTP, newPassword } = req.body;

        const admin = await Admin.findOne({email});
        if (!admin) {
            return res.status(400).json({message: "Admin not found"});
        }

        if (admin.passwordResetOTP !== passwordResetOTP){
            return res.status(400).json({message: "Invalid OTP"});
        }

        if (admin.passwordResetOTPExpiry < new Date()){
            return res.status(400).json({message: "OTP has expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        admin.passwordResetOTP = undefined;
        admin.passwordResetOTPExpiry = undefined;
        await admin.save();

        res.status(200).json({message: "Password reset successful"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export { registerUser, forgottenPassword, verifyOTP, loginUser, logoutUser, resetPassword };