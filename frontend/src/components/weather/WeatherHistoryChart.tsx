import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUnit } from '@/contexts/UnitContext';
import { convertTemperature } from '@/utils/temperature';
import type { WeatherRecord } from '@/types/weather.types';

interface WeatherHistoryChartProps {
  history: WeatherRecord[];
}

export default function WeatherHistoryChart({ history }: WeatherHistoryChartProps) {
  const { unit } = useUnit();
  
  const chartData = history.map((record) => ({
    date: new Date(record.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temperature: Math.round(convertTemperature(record.temperature, record.temperature_unit, unit)),
    fullDate: record.recorded_at,
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Temperature History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature History (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: `Temperature (°${unit})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => [`${value}°${unit}`, 'Temperature']}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

