import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URL);
        console.log('MongoDB connected successfully', conn.connection.host);
    }
    catch (error) {
        console.log('Error while connecting to MongoDB', error);
        process.exit(1);//status code 1 indicates an error 0 measn successful exit
    }
}