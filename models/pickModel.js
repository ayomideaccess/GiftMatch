import mongoose, { Schema } from "mongoose";

const pickSchema = new Schema({
    eventId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    pickerName:{
        type: String,
        required: true
    },
    pickedParticipantId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    pickedName:{
        type: String,
        required: true
    }
}, {
    timestamps: true
    
})

export default mongoose.model("Pick", pickSchema);