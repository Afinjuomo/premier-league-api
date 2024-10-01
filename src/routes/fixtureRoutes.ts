import express from 'express';
import { createFixture, updateFixture, deleteFixture, getAllFixtures } from '../controllers/adminFixtureController';
import { authMiddleware } from '../middlewares/authMiddleware'; // Auth middleware
import { validateFixture } from '../middlewares/validationMiddleware'; // Validation middleware for fixture input
import { loggingMiddleware } from '../middlewares/loggingMiddleware'; // Logging middleware
import { rateLimiter } from '../middlewares/rateLimitingMiddleware'; // Rate limiter middleware

const router = express.Router();

// Logging middleware for all routes
router.use(loggingMiddleware);

// Rate limiter applied to all routes
router.use(rateLimiter);

// Create a fixture (Admin) - Protected route, only accessible by 'admin' role
router.post('/create', authMiddleware('admin'), validateFixture, createFixture);

// Update a fixture (Admin) - Protected route, only accessible by 'admin' role
router.put('/update/:id', authMiddleware('admin'), validateFixture, updateFixture);

// Delete a fixture (Admin) - Protected route, only accessible by 'admin' role
router.delete('/delete/:id', authMiddleware('admin'), deleteFixture);

// Get all fixtures (Admin) - Protected route, only accessible by 'admin' role
router.get('/get-fixtures', authMiddleware('admin'), getAllFixtures);

export default router;
