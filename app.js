import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const startConnection = async () => {
    try {
        await connectDB();
        app.on("error", (error)=>{
            console.error(error);
        })

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
startConnection();

app.use('/api/auth', authRoutes);