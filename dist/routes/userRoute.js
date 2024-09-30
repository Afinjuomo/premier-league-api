"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const fixtureController_1 = require("../controllers/fixtureController");
const searchController_1 = require("../controllers/searchController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rateLimitingMiddleware_1 = require("../middlewares/rateLimitingMiddleware");
const loggingMiddleware_1 = require("../middlewares/loggingMiddleware");
const router = express_1.default.Router();
// Optional: Apply logging middleware to all user routes
router.use(loggingMiddleware_1.loggingMiddleware);
// Create a new user
router.post('/register', validationMiddleware_1.validateUser, userController_1.createUser); // Validation middleware applied
// Login user
router.post('/login', validationMiddleware_1.validateUser, userController_1.loginUser); // Rate limiting and validation applied
// View all teams (User) 
router.get('/view', (0, authMiddleware_1.authMiddleware)('user'), rateLimitingMiddleware_1.rateLimiter, fixtureController_1.viewTeams); // Auth middleware applied
// View completed fixtures (User) 
router.get('/completed', (0, authMiddleware_1.authMiddleware)('user'), rateLimitingMiddleware_1.rateLimiter, fixtureController_1.viewCompletedFixtures); // Auth middleware applied
// View pending fixtures (User) 
router.get('/pending', (0, authMiddleware_1.authMiddleware)('user'), rateLimitingMiddleware_1.rateLimiter, fixtureController_1.viewPendingFixtures); // Auth middleware applied
// Search teams or fixtures (User)
router.get('/search', (0, authMiddleware_1.authMiddleware)('user'), rateLimitingMiddleware_1.rateLimiter, searchController_1.search); // Auth middleware applied
exports.default = router;
