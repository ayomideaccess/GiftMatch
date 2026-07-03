import mongoose, { Schema } from "mongoose";
import validator from "validator";

const adminSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email"
        }
    },
    phoneNo:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    otp:{
        type: String
    },
    otpExpiry:{
        type: Date
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    passwordResetOTP:{
        type: String
    },
    passwordResetOTPExpiry: {
        type: Date
    }
}, {
    timestamps: true
})

adminSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Admin", adminSchema);