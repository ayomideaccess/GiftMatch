import mongoose, { Schema } from "mongoose";
import validator from 'validator';

const specialRequestSchema = new Schema({
    eventId:{
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    name:{
        type: String,
        required: true
    },
    emailAdd:{
        type: String,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email address"
        }
    },
    phone:{
        type: String,
        required: true
    },
    wantToGift:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("SpecialRequest", specialRequestSchema);