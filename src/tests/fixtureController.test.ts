import request from 'supertest';
import app from '../app'; // Your Express app
import jwt from 'jsonwebtoken';
import Fixture from '../models/fixtureModel';
import { connectTestDB, closeTestDB } from '../config/db.test'; // Updated import

// Fake JWT token for testing
const fakeToken = jwt.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

// Helper function to get a future date
const getFutureDate = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

beforeAll(async () => {
    await connectTestDB(); // Connect to test database
});

afterAll(async () => {
    await closeTestDB(); // Ensure DB connection is closed after all tests
});

describe('Fixture Controller', () => {
    beforeEach(async () => {
        // Set up test data
        await Fixture.create({
            homeTeam: 'teamId1',
            awayTeam: 'teamId2',
            date: getFutureDate(2),
            status: 'completed',
            link: 'unique-link-123',
        });

        await Fixture.create({
            homeTeam: 'teamId1',
            awayTeam: 'teamId2',
            date: getFutureDate(3),
            status: 'pending',
            link: 'unique-link-456',
        });
    });

    afterEach(async () => {
        await Fixture.deleteMany({}); // Clean up after each test
    });

    it('should return 200 and list completed fixtures', async () => {
        const response = await request(app)
            .get('/users/completed')
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1); // Expect 1 completed fixture
        expect(response.body[0].status).toBe('completed');
    });

    it('should return 404 when no completed fixtures are found', async () => {
        await Fixture.deleteMany({ status: 'completed' });

        const response = await request(app)
            .get('/users/completed')
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No completed fixtures found');
    });

    it('should return 200 and list pending fixtures', async () => {
        const response = await request(app)
            .get('/users/pending')
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1); // Expect 1 pending fixture
        expect(response.body[0].status).toBe('pending');
    });

    it('should return 404 when no pending fixtures are found', async () => {
        await Fixture.deleteMany({ status: 'pending' });

        const response = await request(app)
            .get('/users/pending')
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No pending fixtures found');
    });

    it('should return 500 on server error when fetching completed fixtures', async () => {
        jest.spyOn(Fixture, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/users/completed')
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error fetching fixtures');
    });
});
