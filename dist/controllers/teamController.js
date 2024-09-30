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
exports.deleteTeam = exports.updateTeam = exports.getTeamById = exports.getTeams = exports.createTeam = void 0;
const teamModel_1 = __importDefault(require("../models/teamModel")); // Assuming you have a Team model
// Create a new team
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, members } = req.body;
    if (!name || !Array.isArray(members)) {
        return res.status(400).json({ message: 'Team name and members are required' });
    }
    try {
        const existingTeam = yield teamModel_1.default.findOne({ name });
        if (existingTeam) {
            return res.status(409).json({ message: 'Team name already exists' });
        }
        const newTeam = new teamModel_1.default({ name, members }); // members can be an array of user IDs or names
        yield newTeam.save();
        res.status(201).json({ message: 'Team created successfully', team: { id: newTeam._id, name: newTeam.name } });
    }
    catch (error) {
        const err = error;
        res.status(400).json({ message: err.message });
    }
});
exports.createTeam = createTeam;
// Get all teams
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield teamModel_1.default.find();
        res.status(200).json(teams);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ message: err.message });
    }
});
exports.getTeams = getTeams;
// Get a single team by ID
const getTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team = yield teamModel_1.default.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json(team);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ message: err.message });
    }
});
exports.getTeamById = getTeamById;
// Update a team
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team = yield teamModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team updated successfully', team });
    }
    catch (error) {
        const err = error;
        res.status(400).json({ message: err.message });
    }
});
exports.updateTeam = updateTeam;
// Delete a team
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team = yield teamModel_1.default.findByIdAndDelete(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team deleted successfully' });
    }
    catch (error) {
        const err = error;
        res.status(400).json({ message: err.message });
    }
});
exports.deleteTeam = deleteTeam;
