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
// src/tests/adminFixtureController.test.ts
const dotenv_1 = __importDefault(require("dotenv")); // Load environment variables
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const db_test_1 = require("../config/db.test"); // Import closeTestDB
// Load environment variables from .env.test file
dotenv_1.default.config({ path: '.env.test' });
// Create a fake JWT token for testing
const fakeToken = jsonwebtoken_1.default.sign({ id: 'testId', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to the test MongoDB before all tests
    yield (0, db_test_1.connectTestDB)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Close the test MongoDB connection after all tests
    yield (0, db_test_1.closeTestDB)();
}));
describe('Admin Fixture Controller', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the database before each test
        yield fixtureModel_1.default.deleteMany();
    }));
    test('should create a new fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({
            homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae",
            date: "10-10-2025"
        });
        console.log(response);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Fixture created');
        expect(response.body.fixture).toHaveProperty('homeTeam', 'Team A');
    }));
    test('should return 403 if user is not admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const userToken = jsonwebtoken_1.default.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Access denied');
    }));
    test('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    }));
    test('should update an existing fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/team/66f9d32c5aadce7db20c588f')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ date: "12-12-2027" });
        const fixtureId = createResponse.body.fixture._id;
        const updateResponse = yield (0, supertest_1.default)(app_1.default)
            .put(`/admin/fixtures/fixture/${fixtureId}`)
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ date: "12-12-2027" });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe('Fixture updated successfully');
        expect(updateResponse.body.fixture).toHaveProperty('homeTeam', 'Updated Team A');
    }));
    test('should delete an existing fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/teams/delete-team/66f9d32c5aadce7db20c588f')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });
        const fixtureId = createResponse.body.fixture._id;
        const deleteResponse = yield (0, supertest_1.default)(app_1.default)
            .delete(`/admin/fixtures/fixture/${fixtureId}`)
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('Fixture deleted successfully');
    }));
    test('should return 404 when trying to delete a non-existing fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentId = new mongoose_1.default.Types.ObjectId(); // Generate a new ObjectId
        const deleteResponse = yield (0, supertest_1.default)(app_1.default)
            .delete(`/admin/fixtures/fixture/${nonExistentId}`)
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.message).toBe('Fixture not found');
    }));
    test('should retrieve all fixtures', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/fixtures')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });
        yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/fixture')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-10-01' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/admin/fixtures/fixtures')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Expect two fixtures to be returned
    }));
});
