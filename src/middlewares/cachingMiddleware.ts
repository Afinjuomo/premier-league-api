import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis'; // Assuming you have a Redis client setup

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Example for caching by ID
    redisClient.get(id, (err: any, data: string) => {
        if (err) throw err;
        if (data) {
            return res.status(200).json(JSON.parse(data));
        }
        next(); // Proceed to the next middleware/controller if no cache
    });
};

// To set the cache (use in your controllers where appropriate)
export const setCache = (key: string, data: any) => {
    redisClient.setex(key, 3600, JSON.stringify(data)); // Cache for 1 hour
};
