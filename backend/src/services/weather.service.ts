import { weatherApiClient } from '../utils/weather-api.js';
import { dbService } from './db.service.js';
import type { WeatherRecord, CreateWeatherRecordInput } from '../types/weather.types.js';
import type { WeatherSpot } from '../types/spots.types.js';
import { ApiError } from '../middleware/error-handler.js';

export class WeatherService {
  /**
   * Map OpenWeatherMap API response to database record format
   */
  private mapApiResponseToRecord(
    apiResponse: any,
    spotId: string,
    units: 'metric' | 'imperial' = 'metric'
  ): CreateWeatherRecordInput {
    const current = apiResponse.current;
    const temperatureUnit = units === 'imperial' ? 'F' : 'C';

    return {
      weather_spot_id: spotId,
      temperature: current.temp,
      temperature_unit: temperatureUnit,
      condition: current.weather[0]?.main || 'Unknown',
      humidity: current.humidity ?? null,
      wind_speed: current.wind_speed ?? null,
      wind_direction: current.wind_deg ?? null,
      pressure: current.pressure ?? null,
      recorded_at: new Date(current.dt * 1000).toISOString(),
    };
  }

  /**
   * Fetch fresh weather data from API and save to database
   */
  async fetchAndSaveWeather(spot: WeatherSpot, forceRefresh: boolean = false): Promise<WeatherRecord> {
    // Check cache freshness (10 minutes)
    if (!forceRefresh) {
      const isFresh = await dbService.isWeatherCacheFresh(spot.id, 10);
      if (isFresh) {
        const cached = await dbService.getLatestWeather(spot.id);
        if (cached) {
          return cached;
        }
      }
    }

    try {
      // Fetch from API
      const apiResponse = await weatherApiClient.getWeatherByCoordinates(
        spot.latitude,
        spot.longitude,
        'metric'
      );

      // Map to database format
      const recordInput = this.mapApiResponseToRecord(apiResponse, spot.id, 'metric');

      // Save to database
      const record = await dbService.createWeatherRecord(recordInput);

      return record;
    } catch (error) {
      if (error instanceof Error) {
        const apiError: ApiError = error as ApiError;
        throw apiError;
      }
      throw new Error(`Failed to fetch weather: ${error}`);
    }
  }

  /**
   * Get current weather for a spot (from cache or API)
   */
  async getCurrentWeather(spotId: string, forceRefresh: boolean = false): Promise<WeatherRecord | null> {
    const spot = await dbService.getSpotById(spotId);
    if (!spot) {
      const notFoundError: ApiError = new Error('Spot not found');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    return this.fetchAndSaveWeather(spot, forceRefresh);
  }

  /**
   * Get weather history for a spot
   */
  async getWeatherHistory(spotId: string, days: number = 7): Promise<WeatherRecord[]> {
    const spot = await dbService.getSpotById(spotId);
    if (!spot) {
      const notFoundError: ApiError = new Error('Spot not found');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    return dbService.getWeatherHistory(spotId, days);
  }

  /**
   * Batch fetch weather for all spots
   */
  async batchFetchWeather(forceRefresh: boolean = false): Promise<Map<string, WeatherRecord | null>> {
    const spots = await dbService.getAllSpots();
    const results = new Map<string, WeatherRecord | null>();

    // Fetch weather for all spots in parallel (with rate limiting consideration)
    const promises = spots.map(async (spot) => {
      try {
        const weather = await this.fetchAndSaveWeather(spot, forceRefresh);
        return { spotId: spot.id, weather };
      } catch (error) {
        console.error(`Failed to fetch weather for spot ${spot.id}:`, error);
        return { spotId: spot.id, weather: null };
      }
    });

    const weatherResults = await Promise.all(promises);
    weatherResults.forEach(({ spotId, weather }) => {
      results.set(spotId, weather);
    });

    return results;
  }
}

export const weatherService = new WeatherService();

