import express from 'express';
import { createUser, loginUser } from '../controllers/userController';  
import { viewTeams, viewCompletedFixtures, viewPendingFixtures } from '../controllers/fixtureController';
import { search } from '../controllers/searchController';
import { validateUser } from '../middlewares/validationMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rateLimiter } from '../middlewares/rateLimitingMiddleware'; 
import { loggingMiddleware } from '../middlewares/loggingMiddleware'; 

const router = express.Router();

// Optional: Apply logging middleware to all user routes
router.use(loggingMiddleware);

// Create a new user
router.post('/register', validateUser, createUser); // Validation middleware applied

// Login user
router.post('/login',  validateUser, loginUser); // Rate limiting and validation applied

// View all teams (User) 
router.get('/view', authMiddleware('user'), rateLimiter,  viewTeams); // Auth middleware applied

// View completed fixtures (User) 
router.get('/completed', authMiddleware('user'), rateLimiter, viewCompletedFixtures); // Auth middleware applied

// View pending fixtures (User) 
router.get('/pending', authMiddleware('user'), rateLimiter,  viewPendingFixtures); // Auth middleware applied

// Search teams or fixtures (User)
router.get('/search', authMiddleware('user'), rateLimiter,  search); // Auth middleware applied

export default router;
