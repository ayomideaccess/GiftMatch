import mongoose, { Schema } from "mongoose";

const participantSchema = new Schema({
    name:{type: String, required: true},
    isPicked:{type: Boolean, required: true, default: false},
    pickedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pick",
        default: null
    }
})
const eventSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    participants:[participantSchema],
    startDate:{
        type: Date,
        required: true
    },
    deadline:{
        type: Date,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, {timestamps: true});

eventSchema.methods.getStatus = function(){
    const now = new Date();
    if(now < this.startDate){
        return "upcoming";
    }else if(now >= this.startDate && now <= this.deadline){
        return "ongoing";
    }else{
        return "completed";
    }
}

export default mongoose.model("Event", eventSchema);