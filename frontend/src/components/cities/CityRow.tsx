import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useUpdateSpot } from '@/hooks/useSpots';
import { useUnit } from '@/contexts/UnitContext';
import { convertTemperature, formatTemperature } from '@/utils/temperature';
import type { WeatherSpot } from '@/types/spots.types';
import type { WeatherRecord } from '@/types/weather.types';

interface CityRowProps {
  spot: WeatherSpot;
  weather: WeatherRecord | null;
}

export default function CityRow({ spot, weather }: CityRowProps) {
  const updateSpot = useUpdateSpot();
  const { unit } = useUnit();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateSpot.mutateAsync({
        id: spot.id,
        input: { is_favorite: !spot.is_favorite },
      });
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  return (
    <Link to={`/cities/${spot.id}`}>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="flex-shrink-0"
          >
            <Star
              className={`h-5 w-5 ${
                spot.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
              }`}
            />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <h3 className="font-semibold truncate">{spot.city_name}</h3>
              {spot.country_code && (
                <span className="text-sm text-muted-foreground">({spot.country_code})</span>
              )}
            </div>
            {spot.notes && (
              <p className="text-sm text-muted-foreground truncate mt-1">{spot.notes}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(spot.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {weather && (
            <div className="text-lg font-semibold">
              {formatTemperature(
                convertTemperature(weather.temperature, weather.temperature_unit, unit),
                unit
              )}
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
          </div>
        </div>
      </div>
    </Link>
  );
}

