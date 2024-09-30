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
exports.getAllFixtures = exports.deleteFixture = exports.updateFixture = exports.createFixture = void 0;
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const uuid_1 = require("uuid"); // For generating unique links
// Create a fixture (Admin)
const createFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { homeTeam, awayTeam, date } = req.body;
    // Check for required fields
    if (!homeTeam || !awayTeam || !date) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    try {
        const homeTeamData = yield teamModel_1.default.findById(homeTeam);
        const awayTeamData = yield teamModel_1.default.findById(awayTeam);
        if (!homeTeamData || !awayTeamData) {
            res.status(404).json({ message: 'One or both teams not found' });
            return;
        }
        // Get the referrer from the request
        const referer = req.get('Referer') ? req.get('Referer') : `${req.protocol}://${req.get('host')}`;
        // Generate a unique ID and link
        const uniqueId = (0, uuid_1.v4)();
        const uniqueLink = `${referer}/${uniqueId}`;
        const fixture = new fixtureModel_1.default({
            homeTeam: homeTeamData.name,
            awayTeam: awayTeamData.name,
            date,
            link: uniqueLink
        });
        yield fixture.save();
        console.log('Fixture created:', fixture);
        res.status(201).json({ message: 'Fixture created', fixture });
    }
    catch (error) {
        console.error('Error creating fixture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createFixture = createFixture;
// Update a fixture (Admin)
const updateFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { homeTeam, awayTeam, date } = req.body;
    try {
        const updatedFixture = yield fixtureModel_1.default.findByIdAndUpdate(id, { homeTeam, awayTeam, date }, { new: true });
        if (!updatedFixture) {
            res.status(404).json({ message: 'Fixture not found' });
            return;
        }
        console.log('Fixture updated:', updatedFixture);
        res.status(200).json({ message: 'Fixture updated successfully', fixture: updatedFixture });
    }
    catch (error) {
        console.error('Error updating fixture:', error);
        res.status(500).json({ message: 'Error updating fixture', error });
    }
});
exports.updateFixture = updateFixture;
// Delete a fixture (Admin)
const deleteFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedFixture = yield fixtureModel_1.default.findByIdAndDelete(id);
        if (!deletedFixture) {
            res.status(404).json({ message: 'Fixture not found' });
            return;
        }
        console.log('Fixture deleted:', deletedFixture);
        res.status(200).json({ message: 'Fixture deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting fixture:', error);
        res.status(500).json({ message: 'Error deleting fixture', error });
    }
});
exports.deleteFixture = deleteFixture;
// View all fixtures (Admin)
const getAllFixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fixtures = yield fixtureModel_1.default.find();
        console.log('Retrieved fixtures:', fixtures);
        res.status(200).json(fixtures);
    }
    catch (error) {
        console.error('Error fetching fixtures:', error);
        res.status(500).json({ message: 'Error fetching fixtures', error });
    }
});
exports.getAllFixtures = getAllFixtures;
