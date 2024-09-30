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
const app_1 = __importDefault(require("../app")); // Import your Express app
const db_1 = __importDefault(require("../config/db")); // Import your DB connection function
const teamModel_1 = __importDefault(require("../models/teamModel"));
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)(); // Connect to the test database
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield teamModel_1.default.deleteMany({}); // Clean up the test data
    yield fixtureModel_1.default.deleteMany({});
}));
describe('GET /search', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Set up test data
        const team1 = yield teamModel_1.default.create({ name: 'Lions', city: 'Nairobi', stadium: 'Nairobi Stadium' });
        const team2 = yield teamModel_1.default.create({ name: 'Tigers', city: 'Kampala', stadium: 'Kampala Stadium' });
        yield fixtureModel_1.default.create({ homeTeam: team1._id, awayTeam: team2._id, date: new Date() });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up after each test
        yield teamModel_1.default.deleteMany({});
        yield fixtureModel_1.default.deleteMany({});
    }));
    it('should return 200 and list teams and fixtures when a valid query is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/search')
            .query({ query: 'Lions' });
        expect(response.status).toBe(200);
        expect(response.body.teams).toHaveLength(1);
        expect(response.body.fixtures).toHaveLength(1);
        expect(response.body.teams[0].name).toBe('Lions');
    }));
    it('should return 404 when no teams or fixtures are found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/search')
            .query({ query: 'Bears' }); // Query that doesn't match any team
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teams or fixtures found.');
    }));
    it('should return 400 when the query parameter is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/search');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Query parameter is required and must be a string.');
    }));
    it('should return 400 when the query parameter is not a string', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/search')
            .query({ query: 123 }); // Invalid query type
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Query parameter is required and must be a string.');
    }));
    it('should return 500 on server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock a server error
        jest.spyOn(fixtureModel_1.default, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/search')
            .query({ query: 'Lions' });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error performing search');
    }));
});
