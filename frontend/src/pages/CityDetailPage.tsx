import { useParams, useNavigate } from 'react-router-dom';
import { useSpot, useDeleteSpot } from '@/hooks/useSpots';
import { useWeather, useWeatherHistory, useRefreshWeather } from '@/hooks/useWeather';
import WeatherCard from '@/components/weather/WeatherCard';
import WeatherMetrics from '@/components/weather/WeatherMetrics';
import WeatherHistoryChart from '@/components/weather/WeatherHistoryChart';
import NotesEditor from '@/components/cities/NotesEditor';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: spot, isLoading: spotLoading, error: spotError } = useSpot(id || '');
  const { data: weather, isLoading: weatherLoading } = useWeather(id || '');
  const { data: history = [] } = useWeatherHistory(id || '', 7);
  const refreshWeather = useRefreshWeather();
  const deleteSpot = useDeleteSpot();

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this city?')) {
      return;
    }

    try {
      await deleteSpot.mutateAsync(id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete spot:', error);
      alert('Failed to delete city. Please try again.');
    }
  };

  const handleRefresh = async () => {
    if (!id) return;
    try {
      await refreshWeather.mutateAsync(id);
      // History will be automatically invalidated by the mutation
    } catch (error) {
      console.error('Failed to refresh weather:', error);
      alert('Failed to refresh weather. Please try again.');
    }
  };

  if (spotLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading city details...</p>
      </div>
    );
  }

  if (spotError || !spot) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-destructive">City not found</p>
        <Button onClick={() => navigate('/')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{spot.city_name}</h1>
            {spot.country_code && (
              <p className="text-muted-foreground">{spot.country_code}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshWeather.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshWeather.isPending ? 'animate-spin' : ''}`} />
            Refresh Weather
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteSpot.isPending}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteSpot.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {weatherLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading weather data...</p>
          </CardContent>
        </Card>
      ) : weather ? (
        <>
          <WeatherCard 
            weather={weather} 
            cityName={spot.city_name}
            onRefresh={handleRefresh}
            isRefreshing={refreshWeather.isPending}
          />
          <WeatherMetrics weather={weather} />
          <WeatherHistoryChart history={history} />
        </>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No weather data available</p>
            <div className="flex justify-center mt-4">
              <Button onClick={handleRefresh}>Fetch Weather</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <NotesEditor spotId={spot.id} initialNotes={spot.notes} />
    </div>
  );
}

