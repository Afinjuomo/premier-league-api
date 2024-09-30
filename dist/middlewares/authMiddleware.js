"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware function
const authMiddleware = (roles) => {
    return (req, res, next) => {
        var _a;
        // Extract token
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log the secret for debugging
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const allowedRoles = Array.isArray(roles) ? roles : [roles];
            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            else {
                req.user = decoded; // Attach decoded token to the request object
                next(); // Proceed to next middleware
            }
        }
        catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};
exports.authMiddleware = authMiddleware;
