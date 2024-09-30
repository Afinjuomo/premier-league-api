import { Request, Response } from 'express';
import Fixture from '../models/fixtureModel';
import Team from '../models/teamModel';
import { v4 as uuidv4 } from 'uuid'; // For generating unique links

// Create a fixture (Admin)
export const createFixture = async (req: Request, res: Response): Promise<void> => {
    const { homeTeam, awayTeam, date } = req.body;

    // Check for required fields
    if (!homeTeam || !awayTeam || !date) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        const homeTeamData = await Team.findById(homeTeam);
        const awayTeamData = await Team.findById(awayTeam);

        if (!homeTeamData || !awayTeamData) {
            res.status(404).json({ message: 'One or both teams not found' });
            return;
        }

        // Get the referrer from the request
        const referer = req.get('Referer') ? req.get('Referer') : `${req.protocol}://${req.get('host')}`;

        // Generate a unique ID and link
        const uniqueId = uuidv4();
        const uniqueLink = `${referer}/${uniqueId}`;

        const fixture = new Fixture({
            homeTeam: homeTeamData.name,
            awayTeam: awayTeamData.name,
            date,
            link: uniqueLink
        });

        await fixture.save();

        console.log('Fixture created:', fixture);
        res.status(201).json({ message: 'Fixture created', fixture });
    } catch (error) {
        console.error('Error creating fixture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a fixture (Admin)
export const updateFixture = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { homeTeam, awayTeam, date } = req.body;

    try {
        const updatedFixture = await Fixture.findByIdAndUpdate(
            id,
            { homeTeam, awayTeam, date },
            { new: true }
        );

        if (!updatedFixture) {
            res.status(404).json({ message: 'Fixture not found' });
            return;
        }

        console.log('Fixture updated:', updatedFixture);
        res.status(200).json({ message: 'Fixture updated successfully', fixture: updatedFixture });
    } catch (error) {
        console.error('Error updating fixture:', error);
        res.status(500).json({ message: 'Error updating fixture', error });
    }
};

// Delete a fixture (Admin)
export const deleteFixture = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deletedFixture = await Fixture.findByIdAndDelete(id);

        if (!deletedFixture) {
            res.status(404).json({ message: 'Fixture not found' });
            return;
        }

        console.log('Fixture deleted:', deletedFixture);
        res.status(200).json({ message: 'Fixture deleted successfully' });
    } catch (error) {
        console.error('Error deleting fixture:', error);
        res.status(500).json({ message: 'Error deleting fixture', error });
    }
};

// View all fixtures (Admin)
export const getAllFixtures = async (req: Request, res: Response): Promise<void> => {
    try {
        const fixtures = await Fixture.find();
        console.log('Retrieved fixtures:', fixtures);
        res.status(200).json(fixtures);
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        res.status(500).json({ message: 'Error fetching fixtures', error });
    }
};
