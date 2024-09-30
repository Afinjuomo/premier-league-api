"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = require("body-parser");
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const rateLimitingMiddleware_1 = require("./middlewares/rateLimitingMiddleware"); // Rate limiter middleware
const loggingMiddleware_1 = require("./middlewares/loggingMiddleware"); // Logging middleware
const db_1 = __importDefault(require("./config/db")); // Import database connection
const teamRoute_1 = __importDefault(require("./routes/teamRoute")); // Admin team routes
const fixtureRoutes_1 = __importDefault(require("./routes/fixtureRoutes")); // Admin fixture routes
const userRoute_1 = __importDefault(require("./routes/userRoute")); // User routes
const authMiddleware_1 = require("./middlewares/authMiddleware"); // Auth middleware
// Load environment variables from .env file
dotenv_1.default.config();
// Validate environment variables
if (!process.env.SESSION_SECRET || !process.env.JWT_SECRET) {
    throw new Error('Environment variables SESSION_SECRET or JWT_SECRET are not defined.');
}
// Initialize Express app
const app = (0, express_1.default)();
// Security middleware (Helmet adds secure headers)
app.use((0, helmet_1.default)());
// Logging middleware (logs every incoming request)
app.use(loggingMiddleware_1.loggingMiddleware);
// Middleware for parsing request bodies (JSON and URL encoded)
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET, // Use session secret from environment variables
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
        maxAge: 1000 * 60 * 60, // 1 hour session expiration
    },
}));
// Rate limiter to prevent abuse
app.use(rateLimitingMiddleware_1.rateLimiter);
// Connect to MongoDB
(0, db_1.default)();
// Admin routes (protected with admin auth)
app.use('/admin/teams', (0, authMiddleware_1.authMiddleware)('admin'), teamRoute_1.default);
app.use('/admin/fixtures', (0, authMiddleware_1.authMiddleware)('admin'), fixtureRoutes_1.default);
// User routes (protected with user auth)
app.use('/users', userRoute_1.default);
// Export the app for use in testing or other modules
exports.default = app;
if (require.main === module) { // Ensure this only runs if the script is executed directly
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
