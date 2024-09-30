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
exports.getAllTeams = exports.deleteTeam = exports.updateTeam = exports.createTeam = void 0;
const teamModel_1 = __importDefault(require("../models/teamModel"));
// Create a new team (Admin)
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, city, stadium } = req.body;
    // Check for required fields
    if (!name || !city || !stadium) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    try {
        // Check if the team already exists
        const existingTeam = yield teamModel_1.default.findOne({ name });
        if (existingTeam) {
            res.status(409).json({ message: 'Team already exists' });
            return;
        }
        // Create a new team
        const newTeam = new teamModel_1.default({ name, city, stadium });
        yield newTeam.save();
        res.status(201).json({ message: 'Team created successfully', team: newTeam });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating team', error });
    }
});
exports.createTeam = createTeam;
// Update a team (Admin)
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, city, stadium } = req.body;
    try {
        const updatedTeam = yield teamModel_1.default.findByIdAndUpdate(id, { name, city, stadium }, { new: true });
        if (!updatedTeam) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }
        res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating team', error });
    }
});
exports.updateTeam = updateTeam;
// Delete a team (Admin)
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedTeam = yield teamModel_1.default.findByIdAndDelete(id);
        if (!deletedTeam) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }
        res.status(200).json({ message: 'Team deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting team', error });
    }
});
exports.deleteTeam = deleteTeam;
// View all teams (Admin)
const getAllTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield teamModel_1.default.find();
        res.status(200).json(teams);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
});
exports.getAllTeams = getAllTeams;
