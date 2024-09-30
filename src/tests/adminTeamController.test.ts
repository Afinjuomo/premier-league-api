import dotenv from 'dotenv'; // Load environment variables
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
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

describe('Admin Team Controller', () => {
    beforeEach(async () => {
        // Clean up the database before each test
        await Team.deleteMany(); 
    });

    test('should create a new team', async () => {
        const response = await request(app)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Team created successfully');
        expect(response.body.team).toHaveProperty('name', 'Team A');
    });

    test('should return 403 if user is not admin', async () => {
        const userToken = jwt.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        const response = await request(app)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Team B', city: 'City B', stadium: 'Stadium B' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Access denied');
    });

    test('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: '', city: 'City C', stadium: 'Stadium C' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    test('should update an existing team', async () => {
        const createResponse = await request(app)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });

        const teamId = createResponse.body.team._id;

        const updateResponse = await request(app)
            .put(`/admin/teams/team/${teamId}`) // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Updated Team A', city: 'Updated City A', stadium: 'Updated Stadium A' });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe('Team updated successfully');
        expect(updateResponse.body.team).toHaveProperty('name', 'Updated Team A');
    });

    test('should delete an existing team', async () => {
        const createResponse = await request(app)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });

        const teamId = createResponse.body.team._id;

        const deleteResponse = await request(app)
            .delete(`/admin/teams/delete-team/${teamId}`) // Updated path
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('Team deleted successfully');
    });

    test('should return 404 when trying to delete a non-existing team', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Generate a new ObjectId

        const deleteResponse = await request(app)
            .delete(`/admin/teams/delete-team/${nonExistentId}`) // Updated path
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.message).toBe('Team not found');
    });

    test('should retrieve all teams', async () => {
        await request(app)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team A', city: 'City A', stadium: 'Stadium A' });

        await request(app)
            .post('/admin/teams/register-team') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ name: 'Team B', city: 'City B', stadium: 'Stadium B' });

        const response = await request(app)
            .get('/admin/teams/all-teams') // Updated path
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Expect two teams to be returned
    });
});
