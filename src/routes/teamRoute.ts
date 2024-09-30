import express from 'express';
import { createTeam, updateTeam, deleteTeam, getAllTeams } from '../controllers/adminTeamController';
import { authMiddleware } from '../middlewares/authMiddleware'; // Auth middleware
import { validateTeam } from '../middlewares/validationMiddleware'; // Validation middleware for team input
import { loggingMiddleware } from '../middlewares/loggingMiddleware'; // Logging middleware for request logging
import { rateLimiter } from '../middlewares/rateLimitingMiddleware'; // Rate limiter middleware

const router = express.Router();

// Logging middleware for all routes
router.use(loggingMiddleware);

// Rate limiter applied to all routes
router.use(rateLimiter);

// Create a team (Admin) - Protected route, only accessible by 'admin' role
router.post('/register-team', authMiddleware('admin'), validateTeam, createTeam);

// Update a team (Admin) - Protected route, only accessible by 'admin' role
router.put('/team/:id', authMiddleware('admin'), validateTeam, updateTeam);

// Delete a team (Admin) - Protected route, only accessible by 'admin' role
router.delete('/delete-team/:id', authMiddleware('admin'), deleteTeam);

// Get all teams (Admin) - Protected route, only accessible by 'admin' role
router.get('/all-teams', authMiddleware('admin'), getAllTeams);

export default router;
