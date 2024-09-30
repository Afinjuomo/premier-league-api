"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTestDB = exports.connectTestDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let testConnection = null;
// Use environment variable for the MongoDB connection string
const connectionString = process.env.TEST_MONGODB_URI ||
    'mongodb://localhost:27017/test-database';
// Function to connect to the test database
const connectTestDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (testConnection && testConnection.readyState === 1) {
        console.log('Already connected to the test database');
        return testConnection;
    }
    try {
        testConnection = yield mongoose_1.default.createConnection(connectionString, {});
        // Event listeners for connection status
        testConnection.on('connected', () => {
            console.log('Test MongoDB connected successfully');
        });
        testConnection.on('error', (err) => {
            console.error('Test MongoDB connection error:', err);
            throw new Error('Failed to connect to test database');
        });
        return testConnection;
    }
    catch (error) {
        console.error('Test MongoDB connection error:', error);
        throw error; // Propagate the error for handling upstream
    }
});
exports.connectTestDB = connectTestDB;
// Function to close the test database connection
const closeTestDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (testConnection) {
        yield testConnection.close();
        console.log('Test MongoDB connection closed');
        testConnection = null; // Reset the connection variable
    }
});
exports.closeTestDB = closeTestDB;
