import { supabase } from '../utils/supabase.js';
import type { WeatherSpot, CreateSpotInput, UpdateSpotInput, SpotWithWeather } from '../types/spots.types.js';
import type { WeatherRecord, CreateWeatherRecordInput } from '../types/weather.types.js';
import { ApiError } from '../middleware/error-handler.js';

export class DatabaseService {
  // Weather Spots Operations
  async getAllSpots(): Promise<WeatherSpot[]> {
    const { data, error } = await supabase
      .from('weather_spots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch spots: ${error.message}`);
    }

    return data || [];
  }

  async getSpotById(id: string): Promise<WeatherSpot | null> {
    const { data, error } = await supabase
      .from('weather_spots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch spot: ${error.message}`);
    }

    return data;
  }

  async createSpot(input: CreateSpotInput): Promise<WeatherSpot> {
    const { data, error } = await supabase
      .from('weather_spots')
      .insert({
        city_name: input.city_name,
        country_code: input.country_code || null,
        latitude: input.latitude,
        longitude: input.longitude,
        is_favorite: input.is_favorite || false,
        notes: input.notes || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create spot: ${error.message}`);
    }

    return data;
  }

  async updateSpot(id: string, input: UpdateSpotInput): Promise<WeatherSpot> {
    const updateData: Partial<UpdateSpotInput> = {};
    if (input.city_name !== undefined) updateData.city_name = input.city_name;
    if (input.country_code !== undefined) updateData.country_code = input.country_code;
    if (input.is_favorite !== undefined) updateData.is_favorite = input.is_favorite;
    if (input.notes !== undefined) updateData.notes = input.notes;

    const { data, error } = await supabase
      .from('weather_spots')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        const notFoundError: ApiError = new Error('Spot not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw new Error(`Failed to update spot: ${error.message}`);
    }

    return data;
  }

  async deleteSpot(id: string): Promise<void> {
    const { error } = await supabase
      .from('weather_spots')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        const notFoundError: ApiError = new Error('Spot not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw new Error(`Failed to delete spot: ${error.message}`);
    }
  }

  // Weather Records Operations
  async createWeatherRecord(input: CreateWeatherRecordInput): Promise<WeatherRecord> {
    const { data, error } = await supabase
      .from('weather_records')
      .insert({
        weather_spot_id: input.weather_spot_id,
        temperature: input.temperature,
        temperature_unit: input.temperature_unit,
        condition: input.condition,
        humidity: input.humidity || null,
        wind_speed: input.wind_speed || null,
        wind_direction: input.wind_direction || null,
        pressure: input.pressure || null,
        recorded_at: input.recorded_at,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create weather record: ${error.message}`);
    }

    return data;
  }

  async getLatestWeather(spotId: string): Promise<WeatherRecord | null> {
    const { data, error } = await supabase
      .from('weather_records')
      .select('*')
      .eq('weather_spot_id', spotId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No records found
      }
      throw new Error(`Failed to fetch latest weather: ${error.message}`);
    }

    return data;
  }

  async getWeatherHistory(spotId: string, days: number = 7): Promise<WeatherRecord[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from('weather_records')
      .select('*')
      .eq('weather_spot_id', spotId)
      .gte('recorded_at', cutoffDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch weather history: ${error.message}`);
    }

    return data || [];
  }

  async getAllSpotsWithLatestWeather(): Promise<SpotWithWeather[]> {
    const { data: spots, error: spotsError } = await supabase
      .from('weather_spots')
      .select('*')
      .order('created_at', { ascending: false });

    if (spotsError) {
      throw new Error(`Failed to fetch spots: ${spotsError.message}`);
    }

    if (!spots || spots.length === 0) {
      return [];
    }

    // Get latest weather for each spot
    const spotsWithWeather: SpotWithWeather[] = await Promise.all(
      spots.map(async (spot) => {
        const latestWeather = await this.getLatestWeather(spot.id);
        return {
          ...spot,
          current_weather: latestWeather,
        };
      })
    );

    return spotsWithWeather;
  }

  async isWeatherCacheFresh(spotId: string, maxAgeMinutes: number = 10): Promise<boolean> {
    const latestWeather = await this.getLatestWeather(spotId);
    
    if (!latestWeather) {
      return false;
    }

    const recordedAt = new Date(latestWeather.recorded_at);
    const now = new Date();
    const ageMinutes = (now.getTime() - recordedAt.getTime()) / (1000 * 60);

    return ageMinutes < maxAgeMinutes;
  }
}

export const dbService = new DatabaseService();

