import mongoose from 'mongoose';

let testConnection: mongoose.Connection | null = null;

// Use environment variable for the MongoDB connection string
const connectionString = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/test-database';

// Function to connect to the test database
export const connectTestDB = async (): Promise<mongoose.Connection | null> => {
    if (testConnection && testConnection.readyState === 1) {
        console.log('Already connected to the test database');
        return testConnection;
    }

    try {
        // Create connection to the test database
        testConnection = await mongoose.createConnection(connectionString);

        // Event listeners for connection status
        testConnection.on('connected', () => {
            console.log('Test MongoDB connected successfully');
        });

        testConnection.on('error', (err) => {
            console.error('Test MongoDB connection error:', err);
            throw new Error('Failed to connect to test database');
        });

        return testConnection;
    } catch (error) {
        console.error('Test MongoDB connection error:', error);
        throw error; // Propagate the error for handling upstream
    }
};

// Function to close the test database connection
export const closeTestDB = async (): Promise<void> => {
    if (testConnection) {
        await testConnection.close();
        console.log('Test MongoDB connection closed');
        testConnection = null; // Reset the connection variable
    }
};
