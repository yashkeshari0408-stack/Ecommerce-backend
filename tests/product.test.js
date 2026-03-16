
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let adminToken;
let customerToken;
let productId;

beforeAll(async () => {
  require('dotenv').config();
  await mongoose.connect(process.env.MONGO_URL);

  // create fresh admin
  const admin = await request(app)
    .post('/auth/signup')
    .send({
         name: 'Test Admin', 
      email: `product_admin${Date.now()}@gmail.com`,
      password: '123456',
      role: 'admin'
    });

  adminToken = admin.body.data.token;

  // create fresh customer
  const customer = await request(app)
    .post('/auth/signup')
    .send({
        name:'test customer',
      email: `product_customer${Date.now()}@gmail.com`,
      password: '123456',
      role: 'customer'
    });

  customerToken = customer.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe('Product Routes', () => {

  it('GET /products → should return all products (200)', async () => {
    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });


  it('POST /products → should fail without token (401)', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'Phone',
        price: 1000,
        stock: 10
      });

    expect(res.statusCode).toBe(401);
  });


  it('POST /products → should fail with customer token (403)', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Phone',
        price: 1000,
        stock: 10
      });

    expect(res.statusCode).toBe(403);
  });


  it('POST /products → should fail with missing fields (400)', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Incomplete Product'
      });

    expect(res.statusCode).toBe(400);
  });


  it('POST /products → should create product with admin token (201)', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'iPhone',
        description: 'Apple phone',
        price: 1000,
        stock: 5
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    productId = res.body.data._id;
  });


  it('PUT /products/:id → should fail without token (401)', async () => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .send({ price: 1200 });

    expect(res.statusCode).toBe(401);
  });


  it('PUT /products/:id → should update product with admin token (200)', async () => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 1200 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(1200);
  });


  it('PUT /products/:id → should fail with invalid id (404)', async () => {
    const res = await request(app)
      .put('/products/64b000000000000000000000')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 1500 });

    expect(res.statusCode).toBe(404);
  });

});