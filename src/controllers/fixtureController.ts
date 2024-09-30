import { Request, Response } from 'express';
import Fixture from '../models/fixtureModel';
import Team from '../models/teamModel';

// View teams (User)
export const viewTeams = async (req: Request, res: Response): Promise<void> => {
    try {
        const teams = await Team.find();
        if (!teams.length) {
            res.status(404).json({ message: 'No teams found' });
            return;
        }
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
};

// View completed fixtures (User)
export const viewCompletedFixtures = async (req: Request, res: Response): Promise<void> => {
    try {
        const fixtures = await Fixture.find({ status: 'completed' });
        if (!fixtures.length) {
            res.status(404).json({ message: 'No completed fixtures found' });
            return;
        }
        res.status(200).json(fixtures);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fixtures', error });
    }
};

// View pending fixtures (User)
export const viewPendingFixtures = async (req: Request, res: Response): Promise<void> => {
    try {
        const fixtures = await Fixture.find({ status: 'pending' });
        if (!fixtures.length) {
            res.status(404).json({ message: 'No pending fixtures found' });
            return;
        }
        res.status(200).json(fixtures);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fixtures', error });
    }
};
