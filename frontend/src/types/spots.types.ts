export interface WeatherSpot {
  id: string;
  city_name: string;
  country_code: string | null;
  latitude: number;
  longitude: number;
  is_favorite: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSpotInput {
  city_name: string;
  country_code?: string | null;
  latitude: number;
  longitude: number;
  is_favorite?: boolean;
  notes?: string | null;
}

export interface UpdateSpotInput {
  city_name?: string;
  country_code?: string | null;
  is_favorite?: boolean;
  notes?: string | null;
}

export interface SpotWithWeather extends WeatherSpot {
  current_weather?: WeatherRecord | null;
}

