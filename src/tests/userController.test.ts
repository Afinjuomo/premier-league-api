import request from 'supertest';
import app from '../app'; // Import the app, not the server (no .listen())
import mongoose from 'mongoose'; // Import mongoose to close the connection after the tests

describe('User Controller', () => {
    describe('POST /register', () => {
        it('should register a new user', async () => {
            const uniqueUsername = `testUser_${Date.now()}`; // Create a unique username
            const response = await request(app)
                .post('/users/register')
                .send({
                    username: uniqueUsername,
                    password: 'password123',
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/users/register')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username and password are required');
        });
    });

    describe('POST /login', () => {
        it('should login a user successfully', async () => {
            const uniqueUsername = `testUser_${Date.now()}`; // Create a unique username for registration
            await request(app)
                .post('/users/register')
                .send({
                    username: uniqueUsername,
                    password: 'password123',
                });

            const response = await request(app)
                .post('/users/login')
                .send({
                    username: uniqueUsername,
                    password: 'password123',
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBeDefined(); // Ensure a token is returned
        });

        it('should return 401 for invalid credentials', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({
                    username: 'invalidUser',
                    password: 'wrongPassword',
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });
});

// Ensure MongoDB connection is closed after all tests are done
afterAll(async () => {
    await mongoose.connection.close();
});