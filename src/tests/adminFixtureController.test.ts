import dotenv from 'dotenv'; // Load environment variables
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Fixture from '../models/fixtureModel';
import Team from '../models/teamModel';
import { connectTestDB } from '../config/db.test'; 

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Create a fake JWT token for testing
const fakeToken = jwt.sign({ id: 'testId', role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

beforeAll(async () => {
    // Connect to the test MongoDB before all tests
    await connectTestDB(); 
});

describe('Admin Fixture Controller', () => {
    let teamId1: mongoose.Types.ObjectId;
    let teamId2: mongoose.Types.ObjectId;

    beforeEach(async () => {
        // Clean up the database before each test
        await Fixture.deleteMany();
        await Team.deleteMany();

        // Create teams for testing
        const team1 = new Team({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });
        const team2 = new Team({ name: 'Team B', city: 'City B', stadium: 'Stadium B' });

        teamId1 = (await team1.save())._id;
        teamId2 = (await team2.save())._id;
    });

    test('should create a new fixture', async () => {
        const response = await request(app)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) }); // Date in future

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Fixture created');
        expect(response.body.fixture).toHaveProperty('homeTeam', 'Team A');
        expect(response.body.fixture).toHaveProperty('awayTeam', 'Team B');
    });

    test('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: '', awayTeam: teamId2, date: new Date(Date.now() + 10000) }); // Missing homeTeam

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    test('should return 404 if one or both teams are not found', async () => {
        const nonExistentTeamId = new mongoose.Types.ObjectId(); // Generate a new ObjectId

        const response = await request(app)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: nonExistentTeamId, awayTeam: teamId2, date: new Date(Date.now() + 10000) });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('One or both teams not found');
    });

    test('should update an existing fixture', async () => {
        const createResponse = await request(app)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) });

        const fixtureId = createResponse.body.fixture._id;

        const updateResponse = await request(app)
            .put(`/admin/fixtures/update/${fixtureId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ date: new Date(Date.now() + 20000) }); // New date in future

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe('Fixture updated successfully');
        expect(updateResponse.body.fixture).toHaveProperty('date');
    });

    test('should return 404 when trying to update a non-existing fixture', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Generate a new ObjectId

        const updateResponse = await request(app)
            .put(`/admin/fixtures/update/${nonExistentId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ date: new Date(Date.now() + 10000) });

        expect(updateResponse.status).toBe(404);
        expect(updateResponse.body.message).toBe('Fixture not found');
    });

    test('should delete an existing fixture', async () => {
        const createResponse = await request(app)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) });

        const fixtureId = createResponse.body.fixture._id;

        const deleteResponse = await request(app)
            .delete(`/admin/fixtures/delete/${fixtureId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('Fixture deleted successfully');
    });

    test('should return 404 when trying to delete a non-existing fixture', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Generate a new ObjectId

        const deleteResponse = await request(app)
            .delete(`/admin/fixtures/delete/${nonExistentId}`) // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.message).toBe('Fixture not found');
    });

    test('should retrieve all fixtures', async () => {
        await request(app)
            .post('/admin/fixtures/create') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ homeTeam: teamId1, awayTeam: teamId2, date: new Date(Date.now() + 10000) });

        const response = await request(app)
            .get('/admin/fixtures/all') // Update to your actual route
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1); // Expect one fixture to be returned
    });
});
