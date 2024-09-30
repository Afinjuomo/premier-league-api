"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.cacheMiddleware = void 0;
const redis_1 = __importDefault(require("../config/redis")); // Assuming you have a Redis client setup
const cacheMiddleware = (req, res, next) => {
    const { id } = req.params; // Example for caching by ID
    redis_1.default.get(id, (err, data) => {
        if (err)
            throw err;
        if (data) {
            return res.status(200).json(JSON.parse(data));
        }
        next(); // Proceed to the next middleware/controller if no cache
    });
};
exports.cacheMiddleware = cacheMiddleware;
// To set the cache (use in your controllers where appropriate)
const setCache = (key, data) => {
    redis_1.default.setex(key, 3600, JSON.stringify(data)); // Cache for 1 hour
};
exports.setCache = setCache;
