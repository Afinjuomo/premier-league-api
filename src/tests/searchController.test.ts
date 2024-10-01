import dotenv from 'dotenv'; // Load environment variables
import request from 'supertest';
import app from '../app'; // Your Express app
import jwt from 'jsonwebtoken';
import Fixture from '../models/fixtureModel';
import Team from '../models/teamModel';
import { connectTestDB, closeTestDB } from '../config/db.test'; // DB connection

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Create a fake JWT token for testing
const fakeToken = jwt.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

beforeAll(async () => {
    await connectTestDB(); // Connect to the test database
});

afterAll(async () => {
    // Clean up the database and close connection after all tests
    await Team.deleteMany({});
    await Fixture.deleteMany({});
    await closeTestDB(); // Close test database connection instead of mongoose.connection.close()
});

describe('Search Controller', () => {
    beforeEach(async () => {
        // Set up test data
        const team1 = await Team.create({ name: 'Lions', city: 'Nairobi', stadium: 'Nairobi Stadium' });
        const team2 = await Team.create({ name: 'Tigers', city: 'Kampala', stadium: 'Kampala Stadium' });

        const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await Fixture.create({
            homeTeam: team1._id,
            awayTeam: team2._id,
            date: futureDate,
            link: 'unique-link-123',
        });
    });

    afterEach(async () => {
        // Clean up after each test
        await Team.deleteMany({});
        await Fixture.deleteMany({});
    });

    it('should return 200 and list teams and fixtures when a valid query is provided', async () => {
        const response = await request(app)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 'Lions' });

        expect(response.status).toBe(200);
        expect(response.body.teams).toHaveLength(1);
        expect(response.body.fixtures).toHaveLength(1);
        expect(response.body.teams[0].name).toBe('Lions');
    });

    it('should return 404 when no teams or fixtures are found', async () => {
        const response = await request(app)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 'Bears' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teams or fixtures found.');
    });

    it('should return 400 when the query parameter is missing', async () => {
        const response = await request(app)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({}); // No query

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Query parameter is required and must be a non-empty string.');
    });

    it('should return 400 when the query parameter is not a string', async () => {
        const response = await request(app)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 123 }); // Non-string query

        expect(response.status).toBe(400); // Expecting 400
        expect(response.body.message).toBe('Query parameter is required and must be a non-empty string.'); // Expecting the correct message
    });

    it('should return 500 on server error', async () => {
        // Simulate a server error by mocking the Fixture.find method
        jest.spyOn(Fixture, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/users/search')
            .set('Authorization', `Bearer ${fakeToken}`) // Add Authorization header
            .query({ query: 'Lions' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error performing search');
    });
});
