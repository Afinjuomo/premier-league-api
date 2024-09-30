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
exports.loginUser = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// User signup function
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    // Validate request body
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }
    try {
        // Check if the user already exists
        const existingUser = yield userModel_1.default.findOne({ username });
        if (existingUser) {
            res.status(409).json({ message: 'Username already exists' });
            return;
        }
        // Create a new user
        const newUser = new userModel_1.default({ username, password, role });
        yield newUser.save();
        // Ensure JWT_SECRET is defined
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: newUser.role }, // Payload
        secret, // Secret from environment variables
        { expiresIn: '1h' } // Token expiration time
        );
        // Send the response with the user info and token
        res.status(201).json({
            message: 'User created successfully',
            user: { id: newUser._id, username: newUser.username },
            token, // Send the generated token back to the client
        });
    }
    catch (error) {
        console.error('Error creating user:', error); // Log the error
        res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.createUser = createUser;
// User Login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }
    try {
        // Check if user exists
        const user = yield userModel_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Check if password matches
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, // Payload
        secret, // Secret from environment variables
        { expiresIn: '1h' } // Token expiration time
        );
        console.log('Generated Token:', token);
        res.json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error logging in user:', error); // Log error
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.loginUser = loginUser;
