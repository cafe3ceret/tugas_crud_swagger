import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { setupSwagger } from './src/docs/swagger.js';

dotenv.config();

const app = express();

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Security
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());

// Basic rate limit (opsional)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// Healthcheck
app.get('/', (_, res) => res.json({ status: 'ok', name: 'User Management API' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Swagger UI
setupSwagger(app);

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err?.message);
  res.status(500).json({ message: 'Internal server error', error: err?.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Docs at http://localhost:${port}/docs`);
});
