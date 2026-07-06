import SpecialRequest from '../models/specialRequestModel.js';
import Admin from '../models/adminModel.js';
import { sendSpecialRequestEmail } from '../services/email.service.js';
import Event from '../models/eventModel.js';
import { request } from 'express';


const sendSpecialRequest = async (req, res) =>{
    try{
        const { eventId } = req.params;
        const { name, emailAdd, phone, wantToGift, description } = req.body;
        const event = await Event.findById(eventId);
        if (!event){
            return res.status(404).json({ message: "Event not found" });
        }

        if (!name || !emailAdd || !phone || !wantToGift || !description){
            return res.status(400).json({ message: "All fields are required!" })
        }

        const request = await SpecialRequest.create({
            eventId,
            name,
            emailAdd,
            phone,
            wantToGift,
            description
        })
        const admin = await Admin.findById(event.createdBy);
        await sendSpecialRequestEmail(admin.email, name, wantToGift, description, phone, emailAdd);

        res.status(201).json({ message: "Special Request sent successfully", request})
    } catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export { sendSpecialRequest };