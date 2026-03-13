const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for Mini E-Commerce Backend'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
    // security line removed
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);