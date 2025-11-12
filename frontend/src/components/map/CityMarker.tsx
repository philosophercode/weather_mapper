import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useUnit } from '@/contexts/UnitContext';
import { convertTemperature, formatTemperature } from '@/utils/temperature';
import type { WeatherSpot, WeatherRecord } from '@/types/spots.types';

interface CityMarkerProps {
  spot: WeatherSpot;
  weather: WeatherRecord | null | undefined;
}

export default function CityMarker({ spot, weather }: CityMarkerProps) {
  const navigate = useNavigate();
  const { unit } = useUnit();

  const temperature = weather
    ? formatTemperature(
        convertTemperature(weather.temperature, weather.temperature_unit, unit),
        unit
      )
    : 'N/A';

  // Create custom icon with temperature displayed on the marker
  const customIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; text-align: center;">
          <img 
            src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" 
            style="width: 25px; height: 41px;"
            alt="marker"
          />
          <div style="
            position: absolute;
            top: 2px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            color: #333;
          ">${temperature}</div>
        </div>
      `,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }, [temperature]);

  const handleMarkerClick = () => {
    navigate(`/cities/${spot.id}`);
  };

  return (
    <Marker
      position={[spot.latitude, spot.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div className="text-center">
          <h3 className="font-semibold">{spot.city_name}</h3>
          {spot.country_code && <p className="text-sm text-muted-foreground">{spot.country_code}</p>}
          <p className="text-lg font-bold">{temperature}</p>
          {weather && <p className="text-sm capitalize">{weather.condition}</p>}
          <button
            onClick={handleMarkerClick}
            className="mt-2 text-sm text-primary hover:underline"
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

