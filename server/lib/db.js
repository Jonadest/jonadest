// lib/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const CONNECTIONSTRING = process.env.CONNECTIONSTRING;

export const connectDB = async () => {
  try {
    await mongoose.connect(CONNECTIONSTRING);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
