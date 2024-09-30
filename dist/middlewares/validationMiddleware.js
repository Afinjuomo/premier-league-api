"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixtureValidationMiddleware = exports.validateFixture = exports.teamValidationMiddleware = exports.validateTeam = exports.userValidationMiddleware = exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for creating a user
exports.validateUser = [
    (0, express_validator_1.body)('username').isString().isLength({ min: 3 }),
    (0, express_validator_1.body)('password').isString().isLength({ min: 6 }),
    (0, express_validator_1.body)('role').isString().optional()
];
// Middleware function for handling user validation results
const userValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.userValidationMiddleware = userValidationMiddleware;
// Validation rules for creating a team
exports.validateTeam = [
    (0, express_validator_1.body)('name').isString().notEmpty(),
];
// Middleware function for handling team validation results
const teamValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.teamValidationMiddleware = teamValidationMiddleware;
// Validation rules for creating a fixture
exports.validateFixture = [
    (0, express_validator_1.body)('teamA').isString().notEmpty(),
    (0, express_validator_1.body)('teamB').isString().notEmpty(),
    (0, express_validator_1.body)('date').isDate().isAfter(new Date().toString()),
];
// Middleware function for handling fixture validation results
const fixtureValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.fixtureValidationMiddleware = fixtureValidationMiddleware;
