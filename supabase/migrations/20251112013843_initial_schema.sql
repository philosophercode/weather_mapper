-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create weather_spots table
CREATE TABLE weather_spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_name VARCHAR(255) NOT NULL,
  country_code VARCHAR(2),
  latitude DECIMAL(10, 8) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DECIMAL(11, 8) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create weather_records table
CREATE TABLE weather_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weather_spot_id UUID NOT NULL REFERENCES weather_spots(id) ON DELETE CASCADE,
  temperature DECIMAL(5, 2) NOT NULL,
  temperature_unit VARCHAR(1) NOT NULL DEFAULT 'C' CHECK (temperature_unit IN ('C', 'F')),
  condition VARCHAR(50) NOT NULL,
  humidity INTEGER CHECK (humidity BETWEEN 0 AND 100),
  wind_speed DECIMAL(5, 2),
  wind_direction INTEGER CHECK (wind_direction BETWEEN 0 AND 360),
  pressure DECIMAL(7, 2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_weather_spots_favorite ON weather_spots(is_favorite);
CREATE INDEX idx_weather_spots_location ON weather_spots(latitude, longitude);
CREATE INDEX idx_weather_spots_created_at ON weather_spots(created_at);

CREATE INDEX idx_weather_records_spot_id ON weather_records(weather_spot_id);
CREATE INDEX idx_weather_records_recorded_at ON weather_records(recorded_at);
CREATE INDEX idx_weather_records_spot_recorded ON weather_records(weather_spot_id, recorded_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_weather_spots_updated_at
  BEFORE UPDATE ON weather_spots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

