import { dbService } from './db.service.js';
import { weatherService } from './weather.service.js';
import { weatherApiClient } from '../utils/weather-api.js';
import type { WeatherSpot, CreateSpotInput, UpdateSpotInput, SpotWithWeather } from '../types/spots.types.js';
import { ApiError } from '../middleware/error-handler.js';

export class SpotsService {
  async getAllSpots(): Promise<WeatherSpot[]> {
    return dbService.getAllSpots();
  }

  async getSpotById(id: string): Promise<WeatherSpot | null> {
    return dbService.getSpotById(id);
  }

  async createSpot(input: CreateSpotInput): Promise<WeatherSpot> {
    // Validate coordinates are within valid range
    if (input.latitude < -90 || input.latitude > 90) {
      const error: ApiError = new Error('Latitude must be between -90 and 90');
      error.statusCode = 400;
      throw error;
    }

    if (input.longitude < -180 || input.longitude > 180) {
      const error: ApiError = new Error('Longitude must be between -180 and 180');
      error.statusCode = 400;
      throw error;
    }

    // Create the spot
    const spot = await dbService.createSpot(input);

    // Fetch initial weather data (don't wait for it to complete)
    weatherService.fetchAndSaveWeather(spot).catch((error) => {
      console.error(`Failed to fetch initial weather for spot ${spot.id}:`, error);
    });

    return spot;
  }

  async createSpotFromCityName(
    cityName: string,
    countryCode?: string,
    isFavorite: boolean = false,
    notes?: string | null
  ): Promise<WeatherSpot> {
    // Geocode city to get coordinates
    const geocodeResults = await weatherApiClient.geocodeCity(cityName, countryCode, 1);

    if (geocodeResults.length === 0) {
      const error: ApiError = new Error(`City not found: ${cityName}`);
      error.statusCode = 404;
      throw error;
    }

    const location = geocodeResults[0];

    // Create spot with geocoded coordinates
    const spot = await this.createSpot({
      city_name: location.name,
      country_code: location.country,
      latitude: location.lat,
      longitude: location.lon,
      is_favorite: isFavorite,
      notes: notes || null,
    });

    return spot;
  }

  async updateSpot(id: string, input: UpdateSpotInput): Promise<WeatherSpot> {
    return dbService.updateSpot(id, input);
  }

  async deleteSpot(id: string): Promise<void> {
    await dbService.deleteSpot(id);
  }

  async getAllSpotsWithWeather(): Promise<SpotWithWeather[]> {
    return dbService.getAllSpotsWithLatestWeather();
  }
}

export const spotsService = new SpotsService();

