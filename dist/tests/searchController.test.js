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
const app_1 = __importDefault(require("../app")); // Your Express app
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const db_test_1 = require("../config/db.test"); // DB connection
// Load environment variables from .env.test file
dotenv_1.default.config({ path: '.env.test' });
// Create a fake JWT token for testing
const fakeToken = jsonwebtoken_1.default.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_test_1.connectTestDB)(); // Connect to the test database
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clean up the database and close connection after all tests
    yield teamModel_1.default.deleteMany({});
    yield fixtureModel_1.default.deleteMany({});
    yield (0, db_test_1.closeTestDB)(); // Close test database connection instead of mongoose.connection.close()
}));
describe('Search Controller', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Set up test data
        const team1 = yield teamModel_1.default.create({ name: 'Lions', city: 'Nairobi', stadium: 'Nairobi Stadium' });
        const team2 = yield teamModel_1.default.create({ name: 'Tigers', city: 'Kampala', stadium: 'Kampala Stadium' });
        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        yield fixtureModel_1.default.create({
            homeTeam: team1._id,
            awayTeam: team2._id,
            date: futureDate,
            link: 'unique-link-123',
        });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up after each test
        yield teamModel_1.default.deleteMany({});
        yield fixtureModel_1.default.deleteMany({});
    }));
    it('should return 200 and list teams and fixtures when a valid query is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 'Lions' });
        expect(response.status).toBe(200);
        expect(response.body.teams).toHaveLength(1);
        expect(response.body.fixtures).toHaveLength(1);
        expect(response.body.teams[0].name).toBe('Lions');
    }));
    it('should return 404 when no teams or fixtures are found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 'Bears' });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teams or fixtures found.');
    }));
    it('should return 400 when the query parameter is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({}); // No query
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Query parameter is required and must be a non-empty string.');
    }));
    it('should return 400 when the query parameter is not a string', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 123 }); // Non-string query
        expect(response.status).toBe(400); // Expecting 400
        expect(response.body.message).toBe('Query parameter is required and must be a non-empty string.'); // Expecting the correct message
    }));
    it('should return 500 on server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate a server error by mocking the Fixture.find method
        jest.spyOn(fixtureModel_1.default, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 'Lions' });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error performing search');
    }));
});
