import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';
import pickRoutes from './routes/pick.routes.js';
import specialRequestRoutes from './routes/specialRequest.routes.js';
import errorHandler from './middleware/errorHandler.js';
import routeHandler from './middleware/routeHandler.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

const app = express();

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5500'
];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/pick', pickRoutes);
app.use('/api/special-requests', specialRequestRoutes);

app.use(routeHandler);

app.use(errorHandler);