import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ensure .env is loaded before other imports execute
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 [Server] Todo backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔍 [Health] Health check at http://localhost:${PORT}/health`);
  console.log(`📋 [API] Todos endpoint at http://localhost:${PORT}/api/todos`);
});

// Graceful Shutdown Handler (Essential for Kubernetes / Docker)
const handleGracefulShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('[Database] MongoDB Atlas connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('[Shutdown Error] Failed to close database cleanly:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('[Server] Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server Error] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Server Error] Uncaught Exception:', error);
  process.exit(1);
});
