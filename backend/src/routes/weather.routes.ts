import { Router } from 'express';
import { weatherService } from '../services/weather.service.js';
import { spotsService } from '../services/spots.service.js';
import { validate } from '../middleware/validator.js';
import { spotIdSchema } from '../types/schemas.js';
import { z } from 'zod';
import { ApiError } from '../middleware/error-handler.js';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// GET /api/spots/:id/weather - Get current weather for a spot
router.get('/spots/:id/weather', validate(spotIdSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const forceRefresh = req.query.refresh === 'true';
    
    const weather = await weatherService.getCurrentWeather(id, forceRefresh);
    
    if (!weather) {
      const notFoundError: ApiError = new Error('Weather data not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }

    res.json({ data: weather });
  } catch (error) {
    next(error);
  }
});

// POST /api/spots/:id/weather - Fetch fresh weather from API and save
router.post('/spots/:id/weather', validate(spotIdSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const spot = await spotsService.getSpotById(id);
    
    if (!spot) {
      const notFoundError: ApiError = new Error('Spot not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }

    const weather = await weatherService.fetchAndSaveWeather(spot, true);
    res.json({ data: weather, message: 'Weather data refreshed successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/spots/:id/history - Get weather history for a spot
router.get('/spots/:id/history', validate(spotIdSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
    
    if (isNaN(days) || days < 1 || days > 30) {
      const error: ApiError = new Error('Days parameter must be between 1 and 30');
      error.statusCode = 400;
      return next(error);
    }

    const history = await weatherService.getWeatherHistory(id, days);
    res.json({ data: history });
  } catch (error) {
    next(error);
  }
});

// GET /api/weather/batch - Get weather for all spots at once
router.get('/weather/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const weatherMap = await weatherService.batchFetchWeather(forceRefresh);
    
    // Convert Map to object for JSON response
    const weatherData: Record<string, any> = {};
    weatherMap.forEach((weather, spotId) => {
      weatherData[spotId] = weather;
    });

    res.json({ data: weatherData });
  } catch (error) {
    next(error);
  }
});

export default router;

