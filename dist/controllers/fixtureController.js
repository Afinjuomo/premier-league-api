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
exports.viewPendingFixtures = exports.viewCompletedFixtures = exports.viewTeams = void 0;
const fixtureModel_1 = __importDefault(require("../models/fixtureModel"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
// View teams (User)
const viewTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield teamModel_1.default.find();
        if (!teams.length) {
            res.status(404).json({ message: 'No teams found' });
            return;
        }
        res.status(200).json(teams);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
});
exports.viewTeams = viewTeams;
// View completed fixtures (User)
const viewCompletedFixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fixtures = yield fixtureModel_1.default.find({ status: 'completed' });
        if (!fixtures.length) {
            res.status(404).json({ message: 'No completed fixtures found' });
            return;
        }
        res.status(200).json(fixtures);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching fixtures', error });
    }
});
exports.viewCompletedFixtures = viewCompletedFixtures;
// View pending fixtures (User)
const viewPendingFixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fixtures = yield fixtureModel_1.default.find({ status: 'pending' });
        if (!fixtures.length) {
            res.status(404).json({ message: 'No pending fixtures found' });
            return;
        }
        res.status(200).json(fixtures);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching fixtures', error });
    }
});
exports.viewPendingFixtures = viewPendingFixtures;
