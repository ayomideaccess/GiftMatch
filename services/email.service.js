import dotenv from 'dotenv';
dotenv.config();

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send OTP
export const sendOTPEmail = async (email, otp) =>{
    await resend.emails.send({
        from: `"GiftMatch" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for GiftMatch',
        html: `
        <h2>Welcome to GiftMatch!</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="color: #6366f1">${otp}</h1>
        `
    });
};


// Send OTP
export const sendOTPEmail = async (email, otp) =>{
    await resend.emails.send({
        from: `"GiftMatch" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for GiftMatch',
        html: `
        <h2>Welcome to GiftMatch!</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="color: #6366f1">${otp}</h1>
        <p>This codes expires in <strong>10 minutes</strong>.</p> 
        <p>If you didn't request this, please ignore this email.</p>
        `
    });
};

export const sendLoginEmail = async (email, firstName)=>{
    await resend.emails.send({
        from: `"GiftMatch" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'New login to your GiftMatch account',
        html: `
        <h2>Welcome back, ${firstName}👋</h2>
        <p>You just logged in to your GiftMatch account at <strong>${new Date().toLocaleString()}</strong></p>
        <p>If this wasn't you, please reset your password immediately.</p>
        `
    });
};

export const sendPasswordResetEmail = async (email, passwordResetOTP)=>{
    await resend.emails.send({
        from: `"GiftMatch" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password for your GiftMatch account.</p>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #6366f1">${passwordResetOTP}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        `
    });
};

export const sendSpecialRequestEmail = async (email, requesterName, wantToGift, reason, phone, emailAdd)=>{
    await transporter.sendMail({
        from: `"GiftMatch" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Special Request Received',
        html: `
        <h2>New Special Request🎁</h2>
        <p><strong>From:</strong>${requesterName}</p>
        <p><strong>Want to Gift:</strong>${wantToGift}</p>
        <p><strong>Reason:</strong>${reason}</p>
        <p><strong>Phone:</strong>${phone}</p>
        <p><strong>Email:</strong>${emailAdd}</p>
        `
    });
};

export const sendEventCompletionEmail = async (email, eventName)=>{
    await transporter.sendMail({
        from: `"GiftMatch" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Event Completed Successfully🎉',
        html: `
        <h2>All participants have picked!🎉</h2>
        <p>Your event <strong>${eventName}</strong> is now complete.</p>
        <p>Login to your dashboard to view the results.</p>
        `
});
};