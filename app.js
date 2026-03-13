const express = require("express");
const errorMiddleware = require('./middleware/errorMiddleware');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swaggerConfig');

const app = express();

app.use(express.json());
app.use('/auth', require('./routes/authRoutes'));

app.use('/products', require('./routes/productRoutes'));
app.use('/orders', require('./routes/orderRoutes'));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

module.exports = app;

