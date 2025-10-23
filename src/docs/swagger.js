import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'REST API dengan JWT, CRUD user, upload avatar (Cloudinary).',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.js'], // ⬅️ Tambahkan ini agar Swagger membaca semua routes kamu
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};
