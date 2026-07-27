import Pick from '../models/pickModel.js';
import Event from '../models/eventModel.js';
import Admin from '../models/adminModel.js';
import specialRequest from '../models/specialRequestModel.js';
import { sendEventCompletionEmail } from '../services/email.service.js';
import AppError from '../utils/AppError.js';

const identifyParticipant = async (req,res) =>{
    const { eventId } = req.params;
    const { pickerName } = req.body;

    const event = await Event.findById(eventId);
    if(!event){
        throw new AppError("Event not found", 404);
    }

    const status = event.getStatus();
    if(status === "upcoming"){
        throw new AppError("Event is yet to start", 400);
    }
    if (status === "completed"){
        throw new AppError("Event has ended", 400);
    }

    const participant = event.participants.find(p => p.name.toLowerCase() === pickerName.toLowerCase() );
    if (!participant){
        throw new AppError("Your name is not on the list", 404);
    }
    const existingPick = await Pick.findOne({ eventId, pickerName });
    if (existingPick){
        throw new AppError(`You already picked ${existingPick.pickedName}`, 400);
    }
    res.status(200).json({ message:"Welcome! Please make your pick.", eventTitle: event.title, description: event.description, participants: event.participants });
}

const makePick = async (req,res) =>{
    const { eventId } = req.params;
    const { pickerName, pickedParticipantId} = req.body;

    const event = await Event.findById(eventId);
    if(!event){
        throw new AppError("Event not found", 404);
    }

    const status = event.getStatus();
    if(status === "upcoming"){
        throw new AppError("Event has not started yet",400);
    }
    if (status === "completed"){
        throw new AppError("Event has ended",400);
    }

    const pickerExists = event.participants.find(p => p.name.toLowerCase() === pickerName.toLowerCase() );
    if (!pickerExists){
        throw new AppError("Your name is not on the list",404);
    }
    const alreadyPicked = await Pick.findOne({ eventId, pickerName });
    if (alreadyPicked){
        throw new AppError(`You already picked ${alreadyPicked.pickedName}`, 400);
    }

    const targetParticipant = event.participants.find(p => p._id.toString() === pickedParticipantId);
    if (!targetParticipant){
        throw new AppError("Participant not found", 404);
    }
    if (targetParticipant.isPicked){
        throw new AppError("This person has already been picked", 400);
    }
    if (pickerName.toLowerCase() === targetParticipant.name.toLowerCase()){
        throw new AppError("You cannot pick yourself", 400);
    }

    const updatedEvent = await Event.findOneAndUpdate(
        {
            _id: eventId,
            "participants._id": pickedParticipantId,
            "participants.isPicked": false
        },
        {
            $set: {
                "participants.$.isPicked": true
            }
        },
        { new: true }
    );

    if (!updatedEvent) {
        throw new AppError("This participant has already been picked.",400);
    }
    await Pick.create({
        eventId,
        pickerName,
        pickedParticipantId,
        pickedName: targetParticipant.name
    });

    await Event.updateOne(
        {
            _id: eventId,
            "participants._id": pickedParticipantId
        },
        {
            $set: {
                "participants.$.pickedBy": pickerExists._id
            }
        }
    );

    const allPicked = updatedEvent.participants.every(p => p.isPicked);
    if (allPicked) {
        const admin = await Admin.findById(event.createdBy);
        await sendEventCompletionEmail(admin.email, event.title);
    }

    res.status(201).json({ message: `You have successfully picked ${targetParticipant.name}` })
}

const viewResults = async (req,res) =>{
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event){
        throw new AppError("Event not found",404);
    }

    const picks = await Pick.find({ eventId });
    const specialRequests = await specialRequest.find({ eventId });

    const totalParticipants = event.participants.length;
    const totalPicked = event.participants.filter(p => p.isPicked).length;
    const remaining = totalParticipants - totalPicked;

    res.status(200).json({
        eventTitle: event.title,
        status: event.getStatus(),
        summary:{
            totalParticipants,
            totalPicked,
            remaining
        },
        picks,
        specialRequests
    });
};


export { identifyParticipant, makePick, viewResults };