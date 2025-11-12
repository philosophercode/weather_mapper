import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import type { WeatherRecord } from '@/types/weather.types';
import { useUnit } from '@/contexts/UnitContext';
import { convertTemperature, formatTemperature } from '@/utils/temperature';

interface WeatherCardProps {
  weather: WeatherRecord;
  cityName: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function WeatherCard({ weather, cityName, onRefresh, isRefreshing }: WeatherCardProps) {
  const { unit } = useUnit();
  const convertedTemp = convertTemperature(weather.temperature, weather.temperature_unit, unit);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{cityName}</CardTitle>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh weather data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-5xl font-bold">
              {formatTemperature(convertedTemp, unit)}
            </div>
            <div className="text-lg capitalize text-muted-foreground mt-2">
              {weather.condition}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

