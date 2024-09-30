"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const seedData_1 = __importDefault(require("../seedData"));
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ACPDBu1:qtD3S8%40pcO%2AUXSMEih@cluster0.w1fehma.mongodb.net/mock-premier-league?retryWrites=true&w=majority';
mongoose_1.default.connect(MONGO_URI, {})
    .then(() => {
    console.log('MongoDB connected');
    (0, seedData_1.default)();
})
    .catch(err => {
    console.error('Error connecting to MongoDB', err);
});
