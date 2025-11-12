import { z } from 'zod';
import type { CreateSpotInput, UpdateSpotInput } from './spots.types.js';

export const createSpotSchema = z.object({
  body: z.object({
    city_name: z.string().min(1).max(255),
    country_code: z.string().length(2).optional().nullable(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    is_favorite: z.boolean().optional().default(false),
    notes: z.string().optional().nullable(),
  }),
});

export const updateSpotSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    city_name: z.string().min(1).max(255).optional(),
    country_code: z.string().length(2).optional().nullable(),
    is_favorite: z.boolean().optional(),
    notes: z.string().optional().nullable(),
  }),
});

export const spotIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateSpotRequest = z.infer<typeof createSpotSchema>;
export type UpdateSpotRequest = z.infer<typeof updateSpotSchema>;
export type SpotIdRequest = z.infer<typeof spotIdSchema>;

