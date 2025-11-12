import express, { Express } from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import spotsRoutes from './routes/spots.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import geocodingRoutes from './routes/geocoding.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/spots', spotsRoutes);
  app.use('/api', weatherRoutes);
  app.use('/api/geocoding', geocodingRoutes);

  app.get('/api', (req, res) => {
    res.json({ message: 'Weather Mapper API' });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};

