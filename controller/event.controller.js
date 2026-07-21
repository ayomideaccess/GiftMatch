import Event from '../models/eventModel.js';


const createEvent = async (req,res) =>{
    try {
        const { title, description, participants, startDate, deadline } = req.body;
        if(!title || !description || !participants || !startDate || !deadline ){
            return res.status(400).json({ message: 'All fields are required' });
        }

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
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
}

const getAllEvents = async (req,res) =>{
    try{
        const events = await Event.find({ createdBy: req.admin._id }).populate('createdBy', 'firstName lastName email');
        res.status(200).json(events);
    } catch(error){
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
}

const getEventById = async (req, res) =>{
    try{
        const { id } = req.params;
        const event = await Event.findById(id).populate('createdBy', 'firstName lastName email');
        if(!event){
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch(error){
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
}

const updateEvent = async (req, res) =>{
    try {
        const { id } = req.params;
        const event = await Event.findOneAndUpdate({_id: id, createdBy: req.admin._id}, req.body, { new: true, runValidators: true });
        if(!event){
            return res.status(404).json({ message: 'Event not found' })
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

const deleteEvent = async (req, res) =>{
    try {
        const { id } = req.params;
        const event = await Event.findOneAndDelete({ id, createdAt: req.admin._id });
        if(!event){
            return res.status(404).json({ message: 'Event not found' })
        }
        res.status(200).json({ message: 'Event deleted successfully' })
    } catch (error) {
        res.status(500).json({ message:'Internal Server Error', error: error.message })
    }
}

export { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };