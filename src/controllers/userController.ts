import { Request, Response } from 'express';
import User from '../models/userModel'; 
import jwt from 'jsonwebtoken';

// User signup function
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password, role} = req.body;

    // Validate request body
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(409).json({ message: 'Username already exists' });
            return;
        }

        // Create a new user
        const newUser = new User({ username, password, role });
        await newUser.save();

        // Ensure JWT_SECRET is defined
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, // Payload
            secret, // Secret from environment variables
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the response with the user info and token
        res.status(201).json({
            message: 'User created successfully',
            user: { id: newUser._id, username: newUser.username },
            token, // Send the generated token back to the client
        });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            secret, // Secret from environment variables
            { expiresIn: '1h' } // Token expiration time
        );

        console.log('Generated Token:', token); 
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error); // Log error
        res.status(500).json({ message: 'Internal server error', error });
    }
};
