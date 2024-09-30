import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedData from '../seedData';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ACPDBu1:qtD3S8%40pcO%2AUXSMEih@cluster0.w1fehma.mongodb.net/mock-premier-league?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { })
    .then(() => {
        console.log('MongoDB connected');
        seedData();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });
