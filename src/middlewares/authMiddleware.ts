import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the structure of your user type
interface User {
    username: string;
    role: 'admin' | 'user';
}

// Extend the decoded token type
interface DecodedToken extends User {
    id: string;
    iat?: number;
    exp?: number;
}

interface AuthenticatedRequest extends Request {
    user?: DecodedToken;
}

// Middleware function
export const authMiddleware = (roles: ('admin' | 'user') | ('admin' | 'user')[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        // Extract token
        const token = req.headers.authorization?.split(' ')[1];


        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }

        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }

            console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log the secret for debugging

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: 'Access denied' });
                return;
            } else {
                req.user = decoded; // Attach decoded token to the request object
                next(); // Proceed to next middleware
            }
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};
