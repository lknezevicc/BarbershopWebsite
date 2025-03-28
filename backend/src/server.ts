import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import barberRoutes from './routes/barber.routes';
import appointmentRoutes from './routes/appointment.routes';
import userRoutes from './routes/user.routes';
import path from 'path';
import { errorHandler } from './middlewares/errorhandler.middleware';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}!`));
