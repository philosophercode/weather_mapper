import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateSpot } from '@/hooks/useSpots';
import CitySearch from './CitySearch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { GeocodingResult } from '@/types/weather.types';

export default function AddCityForm() {
  const navigate = useNavigate();
  const createSpot = useCreateSpot();
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCitySelect = (result: GeocodingResult) => {
    setSelectedCity(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCity) {
      alert('Please select a city');
      return;
    }

    try {
      const spot = await createSpot.mutateAsync({
        city_name: selectedCity.name,
        country_code: selectedCity.country,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon,
        is_favorite: isFavorite,
        notes: notes || null,
      });

      navigate(`/cities/${spot.id}`);
    } catch (error) {
      console.error('Failed to create spot:', error);
      alert('Failed to add city. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New City</CardTitle>
        <CardDescription>Search for a city to track its weather</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city-search">City</Label>
            <CitySearch onSelect={handleCitySelect} />
            {selectedCity && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedCity.name}, {selectedCity.country}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this city..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
            />
            <Label htmlFor="favorite" className="cursor-pointer">
              Mark as favorite
            </Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={!selectedCity || createSpot.isPending}>
              {createSpot.isPending ? 'Adding...' : 'Add City'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

