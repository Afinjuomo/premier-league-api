"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// MongoDB connection string for the test database
const connectionString = 'mongodb://localhost:27017/test-database';
// Define your fixture schema
const fixtureSchema = new mongoose_1.Schema({
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
});
// Create the Fixture model
const Fixture = mongoose_1.default.model('Fixture', fixtureSchema);
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        yield mongoose_1.default.connect(connectionString, {});
        console.log('Connected to MongoDB');
        // Clear existing data
        yield Fixture.deleteMany();
        // Sample data
        const fixturesData = [
            {
                homeTeam: "Team A",
                awayTeam: "Team B",
                date: new Date('2025-10-10')
            },
            {
                homeTeam: "Team C",
                awayTeam: "Team D",
                date: new Date('2025-10-11')
            },
            {
                homeTeam: "Team E",
                awayTeam: "Team F",
                date: new Date('2025-10-12')
            }
        ];
        // Create and insert instances of Fixture model
        const fixtures = fixturesData.map(data => new Fixture(data));
        yield Fixture.insertMany(fixtures);
        console.log('Data seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding data:', error);
    }
    finally {
        // Close the database connection
        yield mongoose_1.default.connection.close();
        console.log('MongoDB connection closed');
    }
});
// Run the seed function
seedData();
