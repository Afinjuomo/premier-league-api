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
exports.search = void 0;
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
// Public search API (Teams/Fixtures)
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Query parameter is required and must be a string.' });
        return;
    }
    try {
        // Search for teams matching the query
        const teams = yield teamModel_1.default.find({ name: { $regex: query, $options: 'i' } });
        // Get the team IDs from the search results
        const teamIds = teams.map(team => team._id);
        // Search for fixtures where homeTeam or awayTeam matches the found team IDs
        const fixtures = yield fixtureModel_1.default.find({
            $or: [
                { homeTeam: { $in: teamIds } },
                { awayTeam: { $in: teamIds } }
            ]
        })
            .populate('homeTeam', 'name city stadium') // Populate home team details
            .populate('awayTeam', 'name city stadium'); // Populate away team details
        if (teams.length === 0 && fixtures.length === 0) {
            res.status(404).json({ message: 'No teams or fixtures found.' });
            return;
        }
        res.status(200).json({ teams, fixtures });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error performing search', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unexpected error occurred' });
        }
    }
});
exports.search = search;
