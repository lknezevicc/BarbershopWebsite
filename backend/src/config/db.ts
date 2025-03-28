import mongoose from 'mongoose';
import dotenv from 'dotenv';
import initDefaultAdmin from '../utils/initAdmin';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB connected!');
    initDefaultAdmin();
  } catch (error) {
    console.error('MongoDB connection failed!');
    process.exit(1);
  }
};

export default connectDB;