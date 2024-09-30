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
// testSetup.ts
const mongoose_1 = __importDefault(require("mongoose"));
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.test' });
const setupTestData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to your test database using the TEST_MONGODB_URI
    yield mongoose_1.default.connect(process.env.TEST_MONGODB_URI, {});
    // Clear existing data
    yield fixtureModel_1.default.deleteMany({});
    yield teamModel_1.default.deleteMany({});
    // Create test teams
    const teamA = yield teamModel_1.default.create({ name: 'Team A' });
    const teamB = yield teamModel_1.default.create({ name: 'Team B' });
    // Create a test fixture
    yield fixtureModel_1.default.create({
        homeTeam: teamA._id,
        awayTeam: teamB._id,
        date: new Date(Date.now() + 10000), // Set a future date
        status: 'pending',
        link: 'unique-link'
    });
    console.log('Test data set up successfully.');
    yield mongoose_1.default.disconnect();
});
setupTestData().catch((error) => console.error('Error setting up test data:', error));
