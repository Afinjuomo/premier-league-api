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
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const db_test_1 = require("../config/db.test");
// Load environment variables from .env.test file
dotenv_1.default.config({ path: '.env.test' });
// Create a fake JWT token for testing
const fakeToken = jsonwebtoken_1.default.sign({ id: 'testId', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
let teamId1;
let teamId2;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to the test MongoDB before all tests
    yield (0, db_test_1.connectTestDB)();
}));
describe('Admin Fixture Controller', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the database before each test
        yield fixtureModel_1.default.deleteMany();
        yield teamModel_1.default.deleteMany();
        // Create teams for testing
        const team1 = new teamModel_1.default({ name: 'Team C', city: 'City C', stadium: 'Stadium C' });
        const team2 = new teamModel_1.default({ name: 'Team D', city: 'City D', stadium: 'Stadium D' });
        teamId1 = (yield team1.save())._id;
        teamId2 = (yield team2.save())._id;
    }));
    test('should create a new fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) }); // Date in future
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Fixture created');
        expect(response.body.fixture).toHaveProperty('homeTeam', 'Team C');
        expect(response.body.fixture).toHaveProperty('awayTeam', 'Team D');
    }));
    test('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: '', awayTeam: teamId2, date: new Date(Date.now() + 10000) }); // Missing homeTeam
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    }));
    test('should return 404 if one or both teams are not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentTeamId = new mongoose_1.default.Types.ObjectId(); // Generate a new ObjectId
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: nonExistentTeamId, awayTeam: teamId2, date: new Date(Date.now() + 10000) });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('One or both teams not found');
    }));
    test('should update an existing fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) });
        const fixtureId = createResponse.body.fixture._id;
        const updateResponse = yield (0, supertest_1.default)(app_1.default)
            .put(`/admin/fixtures/update/${fixtureId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ date: new Date(Date.now() + 20000) }); // New date in future
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe('Fixture updated successfully');
        expect(updateResponse.body.fixture).toHaveProperty('date');
    }));
    test('should return 404 when trying to update a non-existing fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentId = new mongoose_1.default.Types.ObjectId(); // Generate a new ObjectId
        const updateResponse = yield (0, supertest_1.default)(app_1.default)
            .put(`/admin/fixtures/update/${nonExistentId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ date: new Date(Date.now() + 10000) });
        expect(updateResponse.status).toBe(404);
        expect(updateResponse.body.message).toBe('Fixture not found');
    }));
    test('should delete an existing fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) });
        const fixtureId = createResponse.body.fixture._id;
        const deleteResponse = yield (0, supertest_1.default)(app_1.default)
            .delete(`/admin/fixtures/delete/${fixtureId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('Fixture deleted successfully');
    }));
    test('should return 404 when trying to delete a non-existing fixture', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentId = new mongoose_1.default.Types.ObjectId(); // Generate a new ObjectId
        const deleteResponse = yield (0, supertest_1.default)(app_1.default)
            .delete(`/admin/fixtures/delete/${nonExistentId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.message).toBe('Fixture not found');
    }));
    test('should retrieve all fixtures', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/admin/fixtures/get-fixtures') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1); // Expect one fixture to be returned
    }));
});
