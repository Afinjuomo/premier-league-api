import { Request } from 'express';

interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
}

// Extend the Express Request interface
declare module 'express-serve-static-core' {
    interface Request {
        user?: User; // Mark user as optional
    }
}
