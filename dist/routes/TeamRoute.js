"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminTeamController_1 = require("../controllers/adminTeamController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Auth middleware
const validationMiddleware_1 = require("../middlewares/validationMiddleware"); // Validation middleware for team input
const loggingMiddleware_1 = require("../middlewares/loggingMiddleware"); // Logging middleware for request logging
const rateLimitingMiddleware_1 = require("../middlewares/rateLimitingMiddleware"); // Rate limiter middleware
const router = express_1.default.Router();
// Logging middleware for all routes
router.use(loggingMiddleware_1.loggingMiddleware);
// Rate limiter applied to all routes
router.use(rateLimitingMiddleware_1.rateLimiter);
// Create a team (Admin) - Protected route, only accessible by 'admin' role
router.post('/register-team', (0, authMiddleware_1.authMiddleware)('admin'), validationMiddleware_1.validateTeam, adminTeamController_1.createTeam);
// Update a team (Admin) - Protected route, only accessible by 'admin' role
router.put('/team/:id', (0, authMiddleware_1.authMiddleware)('admin'), validationMiddleware_1.validateTeam, adminTeamController_1.updateTeam);
// Delete a team (Admin) - Protected route, only accessible by 'admin' role
router.delete('/delete-team/:id', (0, authMiddleware_1.authMiddleware)('admin'), adminTeamController_1.deleteTeam);
// Get all teams (Admin) - Protected route, only accessible by 'admin' role
router.get('/all-teams', (0, authMiddleware_1.authMiddleware)('admin'), adminTeamController_1.getAllTeams);
exports.default = router;
