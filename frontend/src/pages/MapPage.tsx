import { lazy, Suspense } from 'react';
import { useSpots } from '@/hooks/useSpots';
import { useBatchWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load map component for code splitting
const MapView = lazy(() => import('@/components/map/MapView'));

export default function MapPage() {
  const { data: spots = [], isLoading: spotsLoading, error: spotsError } = useSpots();
  const { data: weatherData, isLoading: weatherLoading, refetch } = useBatchWeather();

  if (spotsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  if (spotsError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-destructive">Failed to load spots</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weather Map</h1>
          <p className="text-muted-foreground">
            {spots.length} {spots.length === 1 ? 'city' : 'cities'} tracked
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={weatherLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${weatherLoading ? 'animate-spin' : ''}`} />
            Refresh Weather
          </Button>
          <Link to="/cities/add">
            <Button>Add City</Button>
          </Link>
        </div>
      </div>

      {spots.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-4 border rounded-lg">
          <p className="text-muted-foreground">No cities tracked yet</p>
          <Link to="/cities/add">
            <Button>Add Your First City</Button>
          </Link>
        </div>
      ) : (
        <Suspense fallback={<div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Loading map...</p></div>}>
          <MapView spots={spots} weatherData={weatherData} />
        </Suspense>
      )}
    </div>
  );
}

