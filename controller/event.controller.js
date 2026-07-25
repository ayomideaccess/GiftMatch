import Event from '../models/eventModel.js';
import Pick from '../models/pickModel.js';
import AppError from '../utils/AppError.js';


const createEvent = async (req,res) =>{
    const { title, description, participants, startDate, deadline } = req.body;
    const participantList = participants.split(',').map(name => ({ name: name.trim(), isPicked: false }))
    const newEvent = await Event.create({
        title,
        description,
        participants: participantList,
        startDate,
        deadline,
        createdBy: req.admin._id
    })
    res.status(201).json(newEvent);
}

const getAllEvents = async (req,res) =>{
    const events = await Event.find({ createdBy: req.admin._id }).populate('createdBy', 'firstName lastName email');
    res.status(200).json(events);
}

const getEventById = async (req, res) =>{
    const { id } = req.params;
    const event = await Event.findById(id).populate('createdBy', 'firstName lastName email');
    if(!event){
        throw new AppError("Event not found", 404);
    }
    res.status(200).json(event);
}

const updateEvent = async (req, res) =>{
    const { id } = req.params;
    const event = await Event.findOneAndUpdate({_id: id, createdBy: req.admin._id}, req.body, { new: true, runValidators: true });
    if(!event){
        throw new AppError("Event not found", 404);
    }
    res.status(200).json(event);
}

const deleteEvent = async (req, res) =>{
    const { id } = req.params;
    const hasPicked = await Pick.exists({ id, pickedName: {$ne: "", $ne: null} });
    
    if (hasPicked) {
        throw new AppError("You cannot delete this event", 400);
    }
    const event = await Event.findOneAndDelete({ id, createdAt: req.admin._id });
    if(!event){
        throw new AppError("Event not found", 404);
    }
    res.status(200).json({ message: 'Event deleted successfully' });
}

export { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };