"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Import the app, not the server (no .listen())
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose to close the connection after the tests
describe('User Controller', () => {
    describe('POST /register', () => {
        it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const uniqueUsername = `testUser_${Date.now()}`; // Create a unique username
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/users/register')
                .send({
                username: uniqueUsername,
                password: 'password123',
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
        }));
        it('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/users/register')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username and password are required');
        }));
    });
    describe('POST /login', () => {
        it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const uniqueUsername = `testUser_${Date.now()}`; // Create a unique username for registration
            yield (0, supertest_1.default)(app_1.default)
                .post('/users/register')
                .send({
                username: uniqueUsername,
                password: 'password123',
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/users/login')
                .send({
                username: uniqueUsername,
                password: 'password123',
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBeDefined(); // Ensure a token is returned
        }));
        it('should return 401 for invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/users/login')
                .send({
                username: 'invalidUser',
                password: 'wrongPassword',
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        }));
    });
});
// Ensure MongoDB connection is closed after all tests are done
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
