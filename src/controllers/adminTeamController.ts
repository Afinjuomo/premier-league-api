import { Request, Response } from 'express';
import Team from '../models/teamModel';


// Create a new team (Admin)
export const createTeam = async (req: Request, res: Response): Promise<void> => {
    const { name, city, stadium } = req.body;

    // Check for required fields
    if (!name || !city || !stadium) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        // Check if the team already exists
        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            res.status(409).json({ message: 'Team already exists' });
            return;
        }

        // Create a new team
        const newTeam = new Team({ name, city, stadium });
        await newTeam.save();
        res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
        res.status(500).json({ message: 'Error creating team', error });
    }
};


// Update a team (Admin)
export const updateTeam = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, city, stadium } = req.body;

    try {
        const updatedTeam = await Team.findByIdAndUpdate(id, { name, city, stadium }, { new: true });
        if (!updatedTeam) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }
        res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });
    } catch (error) {
        res.status(500).json({ message: 'Error updating team', error });
    }
};

// Delete a team (Admin)
export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deletedTeam = await Team.findByIdAndDelete(id);
        if (!deletedTeam) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team', error });
    }
};

// View all teams (Admin)
export const getAllTeams = async (req: Request, res: Response): Promise<void> => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
};
