import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpots } from '@/hooks/useSpots';
import { useBatchWeather } from '@/hooks/useWeather';
import { useQueryClient } from '@tanstack/react-query';
import CityList from '@/components/cities/CityList';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { api } from '@/services/api';

export default function CityListPage() {
  const { data: spots = [], isLoading, error } = useSpots();
  const { data: weatherData, isFetching: isRefreshingWeather } = useBatchWeather(false);
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshWeather = async () => {
    setIsRefreshing(true);
    try {
      // Fetch fresh weather data with refresh=true
      const freshData = await api.get<Record<string, any>>('/api/weather/batch?refresh=true');
      // Update the query cache
      queryClient.setQueryData(['weather', 'batch', false], freshData);
      // Also invalidate to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['weather', 'batch'] });
    } catch (error) {
      console.error('Failed to refresh weather:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading cities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-destructive">Failed to load cities</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cities</h1>
          <p className="text-muted-foreground">
            {spots.length} {spots.length === 1 ? 'city' : 'cities'} tracked
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshWeather}
            disabled={isRefreshing || isRefreshingWeather}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(isRefreshing || isRefreshingWeather) ? 'animate-spin' : ''}`} />
            Refresh Weather
          </Button>
          <Link to="/cities/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add City
            </Button>
          </Link>
        </div>
      </div>

      <CityList spots={spots} weatherData={weatherData} />
    </div>
  );
}

