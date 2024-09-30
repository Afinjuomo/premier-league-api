"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/redis.ts
// src/config/redis.ts
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Validate required environment variables
if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST is not defined in your environment variables.');
}
if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT is not defined in your environment variables.');
}
// Configure Redis client with enhanced options
const redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined, // Optional password
    db: Number(process.env.REDIS_DB) || 0, // Default to DB 0
    retryStrategy: (times) => {
        // Retry logic for connecting to Redis
        return Math.min(times * 50, 2000); // Retry after increasing intervals
    }
});
// Error handling on connection
redisClient.on('error', (error) => {
    console.error('Redis Client Error', error);
});
// Export the configured Redis client
exports.default = redisClient;
