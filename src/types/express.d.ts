import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; username: string; role: 'admin' | 'user' }; // Extend the user type as needed
        }
    }
}
