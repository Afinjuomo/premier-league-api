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
const dotenv_1 = __importDefault(require("dotenv")); // Load environment variables
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const db_test_1 = require("../config/db.test");
// Load environment variables from .env.test file
dotenv_1.default.config({ path: '.env.test' });
// Create a fake JWT token for testing
const fakeToken = jsonwebtoken_1.default.sign({ id: 'testId', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to the test MongoDB before all tests
    yield (0, db_test_1.connectTestDB)();
}));
describe('Admin Team Controller', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the database before each test
        yield teamModel_1.default.deleteMany();
    }));
    test('should create a new team', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Team created successfully');
        expect(response.body.team).toHaveProperty('name', 'Team A');
    }));
    test('should return 403 if user is not admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const userToken = jsonwebtoken_1.default.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Team B', city: 'City B', stadium: 'Stadium B' });
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Access denied');
    }));
    test('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: '', city: 'City C', stadium: 'Stadium C' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    }));
    test('should update an existing team', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });
        const teamId = createResponse.body.team._id;
        const updateResponse = yield (0, supertest_1.default)(app_1.default)
            .put(`/admin/teams/team/${teamId}`) // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Updated Team A', city: 'Updated City A', stadium: 'Updated Stadium A' });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe('Team updated successfully');
        expect(updateResponse.body.team).toHaveProperty('name', 'Updated Team A');
    }));
    test('should delete an existing team', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });
        const teamId = createResponse.body.team._id;
        const deleteResponse = yield (0, supertest_1.default)(app_1.default)
            .delete(`/admin/teams/delete-team/${teamId}`) // Updated path
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('Team deleted successfully');
    }));
    test('should return 404 when trying to delete a non-existing team', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentId = new mongoose_1.default.Types.ObjectId(); // Generate a new ObjectId
        const deleteResponse = yield (0, supertest_1.default)(app_1.default)
            .delete(`/admin/teams/delete-team/${nonExistentId}`) // Updated path
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.message).toBe('Team not found');
    }));
    test('should retrieve all teams', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });
        yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team B', city: 'City B', stadium: 'Stadium B' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/admin/teams/all-teams') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Expect two teams to be returned
    }));
});
