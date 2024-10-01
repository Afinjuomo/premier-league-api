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
const app_1 = __importDefault(require("../app")); // Your Express app
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const db_test_1 = require("../config/db.test"); // Updated import
// Fake JWT token for testing
const fakeToken = jsonwebtoken_1.default.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
// Helper function to get a future date
const getFutureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_test_1.connectTestDB)(); // Connect to test database
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_test_1.closeTestDB)(); // Ensure DB connection is closed after all tests
}));
describe('Fixture Controller', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Set up test data
        yield fixtureModel_1.default.create({
            homeTeam: 'teamId1',
            awayTeam: 'teamId2',
            date: getFutureDate(2),
            status: 'completed',
            link: 'unique-link-123',
        });
        yield fixtureModel_1.default.create({
            homeTeam: 'teamId1',
            awayTeam: 'teamId2',
            date: getFutureDate(3),
            status: 'pending',
            link: 'unique-link-456',
        });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield fixtureModel_1.default.deleteMany({}); // Clean up after each test
    }));
    it('should return 200 and list completed fixtures', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/completed')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1); // Expect 1 completed fixture
        expect(response.body[0].status).toBe('completed');
    }));
    it('should return 404 when no completed fixtures are found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixtureModel_1.default.deleteMany({ status: 'completed' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/completed')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No completed fixtures found');
    }));
    it('should return 200 and list pending fixtures', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/pending')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1); // Expect 1 pending fixture
        expect(response.body[0].status).toBe('pending');
    }));
    it('should return 404 when no pending fixtures are found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixtureModel_1.default.deleteMany({ status: 'pending' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/pending')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No pending fixtures found');
    }));
    it('should return 500 on server error when fetching completed fixtures', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(fixtureModel_1.default, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/completed')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error fetching fixtures');
    }));
});
