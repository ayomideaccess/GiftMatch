import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

export const protect = async (req, res, next) =>{
    try {
        //get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attain admin to request
        req.admin = await Admin.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
};