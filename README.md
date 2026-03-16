# E-Commerce Backend

A RESTful API backend for an e-commerce platform built with Node.js and Express.js.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Swagger (OpenAPI)

## Prerequisites
- Node.js installed
- MongoDB Atlas account

## Installation

1. Clone the repo
git clone <your-repo-url>

2. Install dependencies
npm install

3. Create .env file in root
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4. Run the server
npm run dev

## API Documentation
Swagger docs available at:
http://localhost:5000/api-docs

## API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /auth/signup | Public | Register new user |
| POST | /auth/login | Public | Login user |

### Products
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /products | Public | Get all products |
| POST | /products | Admin | Add new product |
| PUT | /products/:id | Admin | Update product |

### Orders
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /orders | Customer | Place an order |
| GET | /orders | Customer | Get order history |
| GET | /orders/:id | Customer | Get order details |

## Example Requests

### Signup
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "123456",
  "role": "admin"
}

### Place Order
POST /orders
Authorization: Bearer <token>
{
  "items": [
    { "productId": "product_id_here", "quantity": 2 }
  ]
}

### WORKFLOW

Client (Postman / Swagger)
          ↓
    Express Server
          ↓
    ┌─────────────────────────┐
    │ Routes                  │
    │ auth / product / order  │
    └─────────┬───────────────┘
              ↓
    ┌─────────────────────────┐
    │ Middleware              │
    │ auth / role / error     │
    └─────────┬───────────────┘
              ↓
    ┌─────────────────────────┐
    │ Controllers             │
    │ auth / product / order  │
    └─────────┬───────────────┘
              ↓
    ┌─────────────────────────┐
    │ Models                  │
    │ User / Product / Order  │
    └─────────┬───────────────┘
              ↓
         MongoDB Atlas
                
## Git Branching Strategy
- main → production ready code
- developer → integration branch
- feature/* → individual features
