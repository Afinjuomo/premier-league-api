import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation rules for creating a user
export const validateUser = [
    body('username').isString().isLength({ min: 3 }),
    body('password').isString().isLength({ min: 6 }),
    body('role').isString().optional()
];

// Middleware function for handling user validation results
export const userValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rules for creating a team
export const validateTeam = [
    body('name').isString().notEmpty(),
];

// Middleware function for handling team validation results
export const teamValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rules for creating a fixture
export const validateFixture = [
    body('teamA').isString().notEmpty(),
    body('teamB').isString().notEmpty(),
    body('date').isDate().isAfter(new Date().toString()),
];

// Middleware function for handling fixture validation results
export const fixtureValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
