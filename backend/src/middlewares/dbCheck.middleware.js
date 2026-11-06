import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * In production, blocks requests if MongoDB is offline.
 * In development, allows requests through to the in-memory fallback.
 */
export const checkDbConnection = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && mongoose.connection.readyState !== 1) {
    return ApiResponse.error(
      res,
      'Database is currently unavailable. Please check your MongoDB service or MONGODB_URI configuration.',
      503
    );
  }
  next();
};
