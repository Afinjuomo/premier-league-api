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
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("./models/userModel"));
const teamModel_1 = __importDefault(require("./models/teamModel"));
const fixtureModel_1 = __importDefault(require("./models/fixtureModel"));
const NUM_USERS = 10; // Number of users to create
const NUM_TEAMS = 20; // Number of teams to create
const NUM_FIXTURES = 50; // Number of fixtures to create
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Clear collections
            yield userModel_1.default.deleteMany({});
            yield teamModel_1.default.deleteMany({});
            yield fixtureModel_1.default.deleteMany({});
            // Seed users
            const users = [];
            for (let i = 0; i < NUM_USERS; i++) {
                const user = new userModel_1.default({
                    username: `user${i}`,
                    password: 'password123',
                    role: i === 0 ? 'admin' : 'user' // First user is admin
                });
                users.push(user.save());
            }
            yield Promise.all(users);
            console.log(`Seeded ${NUM_USERS} users`);
            // Seed teams
            const teams = [];
            for (let i = 0; i < NUM_TEAMS; i++) {
                const team = new teamModel_1.default({
                    name: `Team${i}`,
                    city: `City${i}`,
                    stadium: `Stadium${i}`,
                });
                teams.push(team.save());
            }
            const savedTeams = yield Promise.all(teams);
            console.log(`Seeded ${NUM_TEAMS} teams`);
            // Seed fixtures
            const fixtures = [];
            for (let i = 0; i < NUM_FIXTURES; i++) {
                const homeTeam = savedTeams[Math.floor(Math.random() * savedTeams.length)].name;
                const awayTeam = savedTeams[Math.floor(Math.random() * savedTeams.length)].name;
                if (homeTeam !== awayTeam) {
                    const fixture = new fixtureModel_1.default({
                        homeTeam,
                        awayTeam,
                        date: new Date(Date.now() + Math.random() * 10000000000), // Random future date
                        link: `https://fixture${i}.com`,
                    });
                    fixtures.push(fixture.save());
                }
            }
            yield Promise.all(fixtures);
            console.log(`Seeded ${NUM_FIXTURES} fixtures`);
            console.log('Database seeding completed successfully!');
        }
        catch (error) {
            console.error('Error seeding database:', error);
        }
        finally {
            mongoose_1.default.connection.close();
        }
    });
}
exports.default = seedData;
