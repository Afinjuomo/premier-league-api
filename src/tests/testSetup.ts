// testSetup.ts
import mongoose from 'mongoose';
import Fixture from '../models/fixtureModel';
import Team from '../models/teamModel';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const setupTestData = async () => {
    // Connect to your test database using the TEST_MONGODB_URI
    await mongoose.connect(process.env.TEST_MONGODB_URI!, {});

    // Clear existing data
    await Fixture.deleteMany({});
    await Team.deleteMany({});

    // Create test teams
    const teamA = await Team.create({ name: 'Team A' });
    const teamB = await Team.create({ name: 'Team B' });

    // Create a test fixture
    await Fixture.create({
        homeTeam: teamA._id,
        awayTeam: teamB._id,
        date: new Date(Date.now() + 10000), // Set a future date
        status: 'pending',
        link: 'unique-link'
    });

    console.log('Test data set up successfully.');
    await mongoose.disconnect();
};

setupTestData().catch((error) => console.error('Error setting up test data:', error));
