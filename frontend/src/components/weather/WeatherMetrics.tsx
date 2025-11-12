import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Droplets, Wind, Gauge } from 'lucide-react';
import type { WeatherRecord } from '@/types/weather.types';

interface WeatherMetricsProps {
  weather: WeatherRecord;
}

export default function WeatherMetrics({ weather }: WeatherMetricsProps) {
  const metrics = [
    {
      label: 'Humidity',
      value: weather.humidity !== null ? `${weather.humidity}%` : 'N/A',
      icon: Droplets,
    },
    {
      label: 'Wind Speed',
      value: weather.wind_speed !== null ? `${weather.wind_speed} km/h` : 'N/A',
      icon: Wind,
    },
    {
      label: 'Pressure',
      value: weather.pressure !== null ? `${weather.pressure} hPa` : 'N/A',
      icon: Gauge,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className="text-lg font-semibold">{metric.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

