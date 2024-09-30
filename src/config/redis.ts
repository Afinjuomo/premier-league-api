// src/config/redis.ts
// src/config/redis.ts
import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST is not defined in your environment variables.');
}

if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT is not defined in your environment variables.');
}

// Configure Redis client with enhanced options
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined, // Optional password
    db: Number(process.env.REDIS_DB) || 0, // Default to DB 0
    retryStrategy: (times: number) => {
        // Retry logic for connecting to Redis
        return Math.min(times * 50, 2000); // Retry after increasing intervals
    }
});

// Error handling on connection
redisClient.on('error', (error: any) => {
    console.error('Redis Client Error', error);
});

// Export the configured Redis client
export default redisClient;

