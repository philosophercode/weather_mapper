export interface WeatherRecord {
  id: string;
  weather_spot_id: string;
  temperature: number;
  temperature_unit: 'C' | 'F';
  condition: string;
  humidity: number | null;
  wind_speed: number | null;
  wind_direction: number | null;
  pressure: number | null;
  recorded_at: string;
  created_at: string;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

