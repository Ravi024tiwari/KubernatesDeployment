import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import todoRoutes from './routes/todo.routes.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.js';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: isDbConnected ? 'healthy' : 'degraded (in-memory mode)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: isDbConnected ? 'connected (MongoDB)' : 'in-memory dev fallback',
    },
  });
});

// Mount Todo routes
app.use('/api/todos', todoRoutes);

// Catch-all 404 & Global Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
