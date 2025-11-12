import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CityMarker from './CityMarker';
import type { WeatherSpot, SpotWithWeather } from '@/types/spots.types';
import type { WeatherRecord } from '@/types/weather.types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  spots: WeatherSpot[];
  weatherData: Record<string, WeatherRecord | null> | undefined;
}

function MapBounds({ spots }: { spots: WeatherSpot[] }) {
  const map = useMap();

  useEffect(() => {
    if (spots.length > 0) {
      const bounds = L.latLngBounds(
        spots.map((spot) => [spot.latitude, spot.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Default to world view
      map.setView([20, 0], 2);
    }
  }, [map, spots]);

  return null;
}

export default function MapView({ spots, weatherData }: MapViewProps) {
  const defaultCenter: [number, number] = [20, 0];
  const defaultZoom = 2;

  const spotsWithWeather = useMemo(() => {
    return spots.map((spot) => ({
      ...spot,
      current_weather: weatherData?.[spot.id] || null,
    }));
  }, [spots, weatherData]);

  return (
    <div className="h-[calc(100vh-8rem)] w-full rounded-lg border overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds spots={spots} />
        {spotsWithWeather.map((spot) => (
          <CityMarker
            key={spot.id}
            spot={spot}
            weather={spot.current_weather}
          />
        ))}
      </MapContainer>
    </div>
  );
}

