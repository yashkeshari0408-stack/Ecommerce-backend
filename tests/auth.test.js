
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Routes', () => {
    const testEmail = `test${Date.now()}@gmail.com`;

    it('POST /auth/signup — should fail with missing fields', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({});
        expect(res.statusCode).toBe(400);
    });

    it('POST /auth/signup — should create a new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Test User',
                email: testEmail,
                password: '123456',
                role: 'customer'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('token');
    });
    it('POST /auth/signup — should fail with duplicate email', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Test User',
                email: testEmail, // same email already created above
                password: '123456',
                role: 'customer'
            });

        expect(res.statusCode).toBe(409);
    });
    it('POST /auth/signup — should fail with invalid role', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Test User',
                email: `test${Date.now()}@gmail.com`,
                password: '123456',
                role: 'superadmin'
            });

        expect(res.statusCode).toBe(400);
    });

    it('POST /auth/login — should fail with wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: testEmail,
                password: 'wrongpassword'
            });
        expect(res.statusCode).toBe(401);
    });
    it('POST /auth/login — should succeed with valid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: testEmail,
                password: '123456'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('token');
    });

    it('POST /auth/login — should fail with email not found', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'nonexistent@gmail.com',
                password: '123456'
            });

        expect(res.statusCode).toBe(404);
    });

    it('POST /auth/login — should fail with missing fields', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({});
        expect(res.statusCode).toBe(400);
    });

});