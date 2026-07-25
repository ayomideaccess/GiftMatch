import SpecialRequest from '../models/specialRequestModel.js';
import Admin from '../models/adminModel.js';
import { sendSpecialRequestEmail } from '../services/email.service.js';
import Event from '../models/eventModel.js';
import { request } from 'express';
import AppError from '../utils/AppError.js';

const sendSpecialRequest = async (req, res) =>{
    const { eventId } = req.params;
    const { name, emailAdd, phone, wantToGift, description } = req.body;
    const event = await Event.findById(eventId);
    if (!event){
        throw new AppError("Event not found",404);
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

    res.status(201).json({ message: "Special Request sent successfully", request});
}

export { sendSpecialRequest };