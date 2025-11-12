import { Router } from 'express';
import { weatherApiClient } from '../utils/weather-api.js';
import { z } from 'zod';
import { ApiError } from '../middleware/error-handler.js';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

const geocodeQuerySchema = z.object({
  query: z.object({
    q: z.string().min(1),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 5)),
  }),
});

// GET /api/geocoding/search - Search for cities
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || typeof q !== 'string') {
      const error: ApiError = new Error('Query parameter "q" is required');
      error.statusCode = 400;
      return next(error);
    }

    const results = await weatherApiClient.geocodeCity(q, undefined, limit as number);
    res.json({ data: results });
  } catch (error) {
    next(error);
  }
});

export default router;

