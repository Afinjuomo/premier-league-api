import express from 'express';
import session from 'express-session';
import { json, urlencoded } from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimiter } from './middlewares/rateLimitingMiddleware'; // Rate limiter middleware
import { loggingMiddleware } from './middlewares/loggingMiddleware'; // Logging middleware
import { cacheMiddleware } from './middlewares/cachingMiddleware'; // Caching middleware
import connectDB from './config/db'; // Import database connection
import teamRoutes from './routes/teamRoute'; // Admin team routes
import fixtureRoutes from './routes/fixtureRoutes'; // Admin fixture routes
import userRoutes from './routes/userRoute'; // User routes
import { authMiddleware } from './middlewares/authMiddleware'; // Auth middleware

// Load environment variables from .env file
dotenv.config();

// Validate environment variables
if (!process.env.SESSION_SECRET || !process.env.JWT_SECRET) {
    throw new Error('Environment variables SESSION_SECRET or JWT_SECRET are not defined.');
}

// Initialize Express app
const app = express();

// Security middleware (Helmet adds secure headers)
app.use(helmet());

// Logging middleware (logs every incoming request)
app.use(loggingMiddleware);

// Middleware for parsing request bodies (JSON and URL encoded)
app.use(json());
app.use(urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET, // Use session secret from environment variables
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
        maxAge: 1000 * 60 * 60, // 1 hour session expiration
    },
}));

// Rate limiter to prevent abuse
app.use(rateLimiter);

// Connect to MongoDB
connectDB(); 

// Admin routes (protected with admin auth)
app.use('/admin/teams', authMiddleware('admin'), teamRoutes); 
app.use('/admin/fixtures', authMiddleware('admin'), fixtureRoutes); 

// User routes (protected with user auth)
app.use('/users', userRoutes);

// Export the app for use in testing or other modules
export default app;


if (require.main === module) { // Ensure this only runs if the script is executed directly
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
