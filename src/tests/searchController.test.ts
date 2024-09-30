import request from 'supertest';
import app from '../app'; // Import your Express app
import connectDB from '../config/db'; // Import your DB connection function
import Team from '../models/teamModel';
import Fixture from '../models/fixtureModel';

beforeAll(async () => {
    await connectDB(); // Connect to the test database
});

afterAll(async () => {
    await Team.deleteMany({}); // Clean up the test data
    await Fixture.deleteMany({});
});

describe('GET /search', () => {
    beforeEach(async () => {
        // Set up test data
        const team1 = await Team.create({ name: 'Lions', city: 'Nairobi', stadium: 'Nairobi Stadium' });
        const team2 = await Team.create({ name: 'Tigers', city: 'Kampala', stadium: 'Kampala Stadium' });
        
        await Fixture.create({ homeTeam: team1._id, awayTeam: team2._id, date: new Date() });
    });

    afterEach(async () => {
        // Clean up after each test
        await Team.deleteMany({});
        await Fixture.deleteMany({});
    });

    it('should return 200 and list teams and fixtures when a valid query is provided', async () => {
        const response = await request(app)
            .get('/search')
            .query({ query: 'Lions' });

        expect(response.status).toBe(200);
        expect(response.body.teams).toHaveLength(1);
        expect(response.body.fixtures).toHaveLength(1);
        expect(response.body.teams[0].name).toBe('Lions');
    });

    it('should return 404 when no teams or fixtures are found', async () => {
        const response = await request(app)
            .get('/search')
            .query({ query: 'Bears' }); // Query that doesn't match any team

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teams or fixtures found.');
    });

    it('should return 400 when the query parameter is missing', async () => {
        const response = await request(app).get('/search');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Query parameter is required and must be a string.');
    });

    it('should return 400 when the query parameter is not a string', async () => {
        const response = await request(app)
            .get('/search')
            .query({ query: 123 }); // Invalid query type

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Query parameter is required and must be a string.');
    });

    it('should return 500 on server error', async () => {
        // Mock a server error
        jest.spyOn(Fixture, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/search')
            .query({ query: 'Lions' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error performing search');
    });
});
