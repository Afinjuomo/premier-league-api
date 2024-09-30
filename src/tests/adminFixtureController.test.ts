// src/tests/adminFixtureController.test.ts
import dotenv from 'dotenv'; // Load environment variables
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Fixture from '../models/fixtureModel';
import { connectTestDB, closeTestDB } from '../config/db.test'; // Import closeTestDB

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' }); 

// Create a fake JWT token for testing
const fakeToken = jwt.sign({ id: 'testId', role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

beforeAll(async () => {
    // Connect to the test MongoDB before all tests
    await connectTestDB(); 
});

afterAll(async () => {
    // Close the test MongoDB connection after all tests
    await closeTestDB(); 
});

describe('Admin Fixture Controller', () => {
    beforeEach(async () => {
        // Clean up the database before each test
        await Fixture.deleteMany(); 
    });

    test('should create a new fixture', async () => {
        const response = await request(app)
    
            .post('/admin/fixtures/create')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({
                homeTeam: "66fa9f66716bd3cd1abcd7ab",
                awayTeam: "66fa9f66716bd3cd1abcd7ae",
                date: "10-10-2025"
            });
console.log(response)

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Fixture created');
        expect(response.body.fixture).toHaveProperty('homeTeam', 'Team A');
    });

    test('should return 403 if user is not admin', async () => {
        const userToken = jwt.sign({ id: 'testId', role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        const response = await request(app)
            .post('/admin/fixtures/create')
            .set('Authorization', `Bearer ${userToken}`)
            .send({   homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Access denied');
    });

    test('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/admin/fixtures/create')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({   homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    test('should update an existing fixture', async () => {
        const createResponse = await request(app)
            .post('/admin/teams/team/66f9d32c5aadce7db20c588f')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({  date: "12-12-2027"});

        const fixtureId = createResponse.body.fixture._id;

        const updateResponse = await request(app)
            .put(`/admin/fixtures/fixture/${fixtureId}`)
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({   date: "12-12-2027" });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe('Fixture updated successfully');
        expect(updateResponse.body.fixture).toHaveProperty('homeTeam', 'Updated Team A');
    });

    test('should delete an existing fixture', async () => {
        const createResponse = await request(app)
            .post('/admin/teams/delete-team/66f9d32c5aadce7db20c588f')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({   homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });

        const fixtureId = createResponse.body.fixture._id;

        const deleteResponse = await request(app)
            .delete(`/admin/fixtures/fixture/${fixtureId}`)
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('Fixture deleted successfully');
    });

    test('should return 404 when trying to delete a non-existing fixture', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Generate a new ObjectId

        const deleteResponse = await request(app)
            .delete(`/admin/fixtures/fixture/${nonExistentId}`)
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body.message).toBe('Fixture not found');
    });

    test('should retrieve all fixtures', async () => {
        await request(app)
            .post('/admin/fixtures/fixtures')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({   homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-09-30' });

        await request(app)
            .post('/admin/fixtures/fixture')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({  homeTeam: "66fa9f66716bd3cd1abcd7ab",
            awayTeam: "66fa9f66716bd3cd1abcd7ae", date: '2024-10-01' });

        const response = await request(app)
            .get('/admin/fixtures/fixtures')
            .set('Authorization', `Bearer ${fakeToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Expect two fixtures to be returned
    });
});
