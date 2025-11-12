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

export interface WeatherApiResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise?: number;
    sunset?: number;
    temp: number;
    feels_like?: number;
    pressure?: number;
    humidity?: number;
    dew_point?: number;
    uvi?: number;
    clouds?: number;
    visibility?: number;
    wind_speed?: number;
    wind_deg?: number;
    wind_gust?: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  minutely?: Array<{
    dt: number;
    precipitation: number;
  }>;
  hourly?: Array<unknown>;
  daily?: Array<unknown>;
  alerts?: Array<unknown>;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CreateWeatherRecordInput {
  weather_spot_id: string;
  temperature: number;
  temperature_unit: 'C' | 'F';
  condition: string;
  humidity?: number | null;
  wind_speed?: number | null;
  wind_direction?: number | null;
  pressure?: number | null;
  recorded_at: string;
}

