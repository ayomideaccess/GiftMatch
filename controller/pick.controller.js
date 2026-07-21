import Pick from '../models/pickModel.js';
import Event from '../models/eventModel.js';
import Admin from '../models/adminModel.js';
import specialRequest from '../models/specialRequestModel.js';
import { sendEventCompletionEmail } from '../services/email.service.js';

const identifyParticipant = async (req,res) =>{
    try {
        const { eventId } = req.params;
        const { pickerName } = req.body;

        const event = await Event.findById(eventId);
        if(!event){
            return res.status(404).json({ message: "Event not found" });
        }

        const status = event.getStatus();
        if(status === "upcoming"){
            return res.status(400).json({ message:"Event has not started yet" });
        }
        if (status === "completed"){
            return res.status(400).json({ message:"Event has ended" });
        }

        const participant = event.participants.find(p => p.name.toLowerCase() === pickerName.toLowerCase() );
        if (!participant){
            return res.status(400).json({ message: "Your name is not on the list" });
        }
        const existingPick = await Pick.findOne({ eventId, pickerName });
        if (existingPick){
            return res.status(200).json({ message: "You already picked someone", pickedName: existingPick.pickedName });
        }
        res.status(200).json({ message:"Welcome! Please make your pick.", eventTitle: event.title, description: event.description, participants: event.participants });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

const makePick = async (req,res) =>{
    try {
        const { eventId } = req.params;
        const { pickerName, pickedParticipant, pickedName } = req.body;
        const pickedParticipantId = req.body.pickedParticipant._id;

        const event = await Event.findById(eventId);
        if(!event){
            return res.status(404).json({ message: "Event not found" });
        }

        const status = event.getStatus();
        if(status === "upcoming"){
            return res.status(400).json({ message:"Event has not started yet" });
        }
        if (status === "completed"){
            return res.status(400).json({ message:"Event has ended" });
        }

        const pickerExists = event.participants.find(p => p.name.toLowerCase() === pickerName.toLowerCase() );
        if (!pickerExists){
            return res.status(400).json({ message: "Your name is not on the list" });
        }
        const alreadyPicked = await Pick.findOne({ eventId, pickerName });
        if (alreadyPicked){
            return res.status(400).json({ message:"You already picked", pickedName: alreadyPicked.pickedName });
        }

        const targetParticipant = event.participants.id(pickedParticipantId);
        if (!targetParticipant){
            return res.status(404).json({ message:"Participant not found" });
        }
        if (!targetParticipant.isPicked){
            return res.status(400).json({ message: "This person has already been picked" });
        }
        if (pickerName.toLowerCase() === pickedName.toLowerCase()){
            return res.json({ message: "You cannot pick yourself" });
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
            return res.status(400).json({
                message: "This participant has already been picked."
            });
        }
        await Pick.create({
            eventId,
            pickerName,
            pickedParticipantId,
            pickedName
        });

        await Event.updateOne(
            {
                _id: eventId,
                "participants._id": pickedParticipantId
            },
            {
                $set: {
                    "participants.$.pickedBy": pick._id
                }
            }
        );

        const allPicked = event.participants.every(p => p.isPicked);
        if (allPicked) {
            const admin = await Admin.findById(event.createdBy);
            await sendEventCompletionEmail(admin.email, event.title);
        }

        res.status(201).json({ message: `You have successfully picked ${pickedName}` })

    } catch (error) {
        res.status(500).json({ message: "Error picking", error: error.message })
    }
}

const viewResults = async (req,res) =>{
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event){
            return res.status(404).json({ message: "Event not found" });
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
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export { identifyParticipant, makePick, viewResults };