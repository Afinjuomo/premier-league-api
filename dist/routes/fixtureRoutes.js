"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminFixtureController_1 = require("../controllers/adminFixtureController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Auth middleware
const validationMiddleware_1 = require("../middlewares/validationMiddleware"); // Validation middleware for fixture input
const loggingMiddleware_1 = require("../middlewares/loggingMiddleware"); // Logging middleware
const rateLimitingMiddleware_1 = require("../middlewares/rateLimitingMiddleware"); // Rate limiter middleware
const router = express_1.default.Router();
// Logging middleware for all routes
router.use(loggingMiddleware_1.loggingMiddleware);
// Rate limiter applied to all routes
router.use(rateLimitingMiddleware_1.rateLimiter);
// Create a fixture (Admin) - Protected route, only accessible by 'admin' role
router.post('/create', (0, authMiddleware_1.authMiddleware)('admin'), validationMiddleware_1.validateFixture, adminFixtureController_1.createFixture);
// Update a fixture (Admin) - Protected route, only accessible by 'admin' role
router.put('/update/:id', (0, authMiddleware_1.authMiddleware)('admin'), validationMiddleware_1.validateFixture, adminFixtureController_1.updateFixture);
// Delete a fixture (Admin) - Protected route, only accessible by 'admin' role
router.delete('/delete/:id', (0, authMiddleware_1.authMiddleware)('admin'), adminFixtureController_1.deleteFixture);
// Get all fixtures (Admin) - Protected route, only accessible by 'admin' role
router.get('/get-fixtures', (0, authMiddleware_1.authMiddleware)('admin'), adminFixtureController_1.getAllFixtures);
exports.default = router;
