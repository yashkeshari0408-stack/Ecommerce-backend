const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let adminToken;
let customerToken;
let productId;
let orderId;

beforeAll(async () => {
  require('dotenv').config();
  await mongoose.connect(process.env.MONGO_URL);

  const admin = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Admin1',
      email: `order_admin${Date.now()}@gmail.com`,
      password: '123456',
      role: 'admin'
    });
  adminToken = admin.body.data.token;

  const customer = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Customer1',
      email: `order_customer${Date.now()}@gmail.com`,
      password: '123456',
      role: 'customer'
    });
  customerToken = customer.body.data.token;

  const product = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Test Product',
      description: 'Test desc',
      price: 500,
      stock: 5
    });
  productId = product.body.data._id;

  // create order for GET tests
  const order = await request(app)
    .post('/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      items: [{ productId, quantity: 1 }]
    });
  orderId = order.body.data._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Order Routes', () => {

  it('POST /orders → should fail without token (401)', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ items: [{ productId, quantity: 1 }] });
    expect(res.statusCode).toBe(401);
  });

  it('POST /orders → should fail with admin token (403)', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ items: [{ productId, quantity: 1 }] });
    expect(res.statusCode).toBe(403);
  });

  it('POST /orders → should fail with missing items (400)', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('POST /orders → should fail with insufficient stock (400)', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ productId, quantity: 10 }] });
    expect(res.statusCode).toBe(400);
  });

  it('POST /orders → should place order successfully (201)', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ items: [{ productId, quantity: 1 }] });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    // orderId already set in beforeAll
  });

  it('GET /orders → should fail without token (401)', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(401);
  });

  it('GET /orders → should return order history (200)', async () => {
    const res = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /orders/:id → should fail without token (401)', async () => {
    const res = await request(app).get(`/orders/${orderId}`);
    expect(res.statusCode).toBe(401);
  });

  it('GET /orders/:id → should return order details (200)', async () => {
    const res = await request(app)
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(orderId);
  });

  it('GET /orders/:id → should fail with invalid id (404)', async () => {
    const res = await request(app)
      .get('/orders/64b000000000000000000000')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(404);
  });

});