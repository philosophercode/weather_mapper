import axios from 'axios';
import type { WeatherApiResponse, GeocodingResult } from '../types/weather.types.js';
import { ApiError } from '../middleware/error-handler.js';

const WEATHER_API_URL = process.env.WEATHER_API_URL || 'https://api.openweathermap.org';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if (!WEATHER_API_KEY) {
  console.warn('Warning: WEATHER_API_KEY not set. Weather API calls will fail.');
}

const API_BASE_URL = `${WEATHER_API_URL}/data/3.0/onecall`;
const GEOCODING_API_URL = `${WEATHER_API_URL}/geo/1.0/direct`;
const CURRENT_WEATHER_API_URL = `${WEATHER_API_URL}/data/2.5/weather`;

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryRequest<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on 400 or 404 errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400 || status === 404) {
          throw error;
        }
        if (status === 429) {
          // Rate limit - wait longer before retry
          await sleep(retryDelay * (attempt + 1) * 2);
          continue;
        }
      }

      if (attempt < maxRetries) {
        await sleep(retryDelay * (attempt + 1));
        continue;
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

export class WeatherApiClient {
  async geocodeCity(cityName: string, countryCode?: string, limit: number = 5): Promise<GeocodingResult[]> {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key not configured');
    }

    const query = countryCode ? `${cityName},${countryCode}` : cityName;

    try {
      const response = await axios.get<GeocodingResult[]>(GEOCODING_API_URL, {
        params: {
          q: query,
          limit,
          appid: WEATHER_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        if (status === 401) {
          const apiError: ApiError = new Error('Invalid weather API key');
          apiError.statusCode = 500;
          throw apiError;
        }
        
        const apiError: ApiError = new Error(`Geocoding failed: ${message}`);
        apiError.statusCode = status || 500;
        throw apiError;
      }
      throw error;
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<WeatherApiResponse> {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key not configured');
    }

    try {
      const response = await retryRequest(() =>
        axios.get<WeatherApiResponse>(API_BASE_URL, {
          params: {
            lat,
            lon,
            appid: WEATHER_API_KEY,
            units,
            exclude: 'minutely,hourly,daily,alerts', // Only get current weather
          },
        })
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        const message = data?.message || error.message;

        // Try fallback API for 400/401 errors (One Call API 3.0 requires paid subscription)
        if (status === 400 || status === 401) {
          console.log('One Call API 3.0 not available, trying fallback API 2.5...');
          return this.getWeatherByCoordinatesFallback(lat, lon, units);
        }

        if (status === 404) {
          const apiError: ApiError = new Error('Weather data not found for this location');
          apiError.statusCode = 404;
          throw apiError;
        }

        if (status === 429) {
          const apiError: ApiError = new Error('Weather API rate limit exceeded. Please try again later.');
          apiError.statusCode = 429;
          throw apiError;
        }

        const apiError: ApiError = new Error(`Weather API error: ${message}`);
        apiError.statusCode = status || 500;
        throw apiError;
      }
      throw error;
    }
  }

  async getWeatherByCoordinatesFallback(lat: number, lon: number, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<WeatherApiResponse> {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key not configured');
    }

    try {
      const response = await axios.get(`${CURRENT_WEATHER_API_URL}`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units,
        },
      });

      // Transform API 2.5 response to match One Call API 3.0 structure
      const data = response.data;
      return {
        lat: data.coord.lat,
        lon: data.coord.lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezone_offset: 0,
        current: {
          dt: data.dt,
          sunrise: data.sys?.sunrise,
          sunset: data.sys?.sunset,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          wind_speed: data.wind?.speed,
          wind_deg: data.wind?.deg,
          weather: data.weather.map((w: any) => ({
            id: w.id,
            main: w.main,
            description: w.description,
            icon: w.icon,
          })),
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        const apiError: ApiError = new Error(`Weather API error: ${message}`);
        apiError.statusCode = status || 500;
        throw apiError;
      }
      throw error;
    }
  }

  async getWeatherByCityName(cityName: string, countryCode?: string, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<WeatherApiResponse> {
    // First geocode to get coordinates
    const geocodeResults = await this.geocodeCity(cityName, countryCode, 1);
    
    if (geocodeResults.length === 0) {
      const apiError: ApiError = new Error(`City not found: ${cityName}`);
      apiError.statusCode = 404;
      throw apiError;
    }

    const { lat, lon } = geocodeResults[0];
    return this.getWeatherByCoordinates(lat, lon, units);
  }
}

export const weatherApiClient = new WeatherApiClient();

