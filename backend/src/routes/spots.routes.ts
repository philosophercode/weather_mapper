import { Router } from 'express';
import { spotsService } from '../services/spots.service.js';
import { validate } from '../middleware/validator.js';
import { createSpotSchema, updateSpotSchema, spotIdSchema } from '../types/schemas.js';
import { ApiError } from '../middleware/error-handler.js';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// GET /api/spots - List all weather spots
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spots = await spotsService.getAllSpots();
    res.json({ data: spots });
  } catch (error) {
    next(error);
  }
});

// POST /api/spots - Add a new weather spot
router.post('/', validate(createSpotSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body;
    const spot = await spotsService.createSpot(input);
    res.status(201).json({ data: spot, message: 'Weather spot created successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/spots/:id - Get spot details
router.get('/:id', validate(spotIdSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const spot = await spotsService.getSpotById(id);
    
    if (!spot) {
      const notFoundError: ApiError = new Error('Spot not found');
      notFoundError.statusCode = 404;
      return next(notFoundError);
    }

    res.json({ data: spot });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/spots/:id - Update spot
router.patch('/:id', validate(updateSpotSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const input = req.body;
    const spot = await spotsService.updateSpot(id, input);
    res.json({ data: spot, message: 'Weather spot updated successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/spots/:id - Remove a weather spot
router.delete('/:id', validate(spotIdSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await spotsService.deleteSpot(id);
    res.json({ message: 'Weather spot deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

