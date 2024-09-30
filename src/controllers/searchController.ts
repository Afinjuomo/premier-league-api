import { Request, Response } from 'express';
import Fixture from '../models/fixtureModel';
import Team from '../models/teamModel';

// Public search API (Teams/Fixtures)
export const search = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Query parameter is required and must be a string.' });
        return;
    }

    try {
        // Search for teams matching the query
        const teams = await Team.find({ name: { $regex: query, $options: 'i' } });

        // Get the team IDs from the search results
        const teamIds = teams.map(team => team._id);

        // Search for fixtures where homeTeam or awayTeam matches the found team IDs
        const fixtures = await Fixture.find({
            $or: [
                { homeTeam: { $in: teamIds } },
                { awayTeam: { $in: teamIds } }
            ]
        })
        .populate('homeTeam', 'name city stadium')  // Populate home team details
        .populate('awayTeam', 'name city stadium'); // Populate away team details

        if (teams.length === 0 && fixtures.length === 0) {
            res.status(404).json({ message: 'No teams or fixtures found.' });
            return;
        }

        res.status(200).json({ teams, fixtures });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error performing search', error: error.message });
        } else {
            res.status(500).json({ message: 'Unexpected error occurred' });
        }
    }
};
