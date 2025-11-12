import { useState, useMemo } from 'react';
import { Input } from '../ui/input';
import CityRow from './CityRow';
import type { WeatherSpot } from '@/types/spots.types';
import type { WeatherRecord } from '@/types/weather.types';

interface CityListProps {
  spots: WeatherSpot[];
  weatherData?: Record<string, WeatherRecord | null>;
}

type SortField = 'city_name' | 'created_at' | 'is_favorite';
type SortDirection = 'asc' | 'desc';

export default function CityList({ spots, weatherData }: CityListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedSpots = useMemo(() => {
    let filtered = spots.filter((spot) => {
      const query = searchQuery.toLowerCase();
      return (
        spot.city_name.toLowerCase().includes(query) ||
        spot.country_code?.toLowerCase().includes(query) ||
        spot.notes?.toLowerCase().includes(query)
      );
    });

    filtered.sort((a, b) => {
      let aValue: string | number | boolean;
      let bValue: string | number | boolean;

      switch (sortField) {
        case 'city_name':
          aValue = a.city_name.toLowerCase();
          bValue = b.city_name.toLowerCase();
          break;
        case 'is_favorite':
          aValue = a.is_favorite ? 1 : 0;
          bValue = b.is_favorite ? 1 : 0;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [spots, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Sort by:</span>
          <button
            onClick={() => handleSort('city_name')}
            className={`px-2 py-1 rounded ${
              sortField === 'city_name' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            Name {sortField === 'city_name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('is_favorite')}
            className={`px-2 py-1 rounded ${
              sortField === 'is_favorite' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            Favorite {sortField === 'is_favorite' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('created_at')}
            className={`px-2 py-1 rounded ${
              sortField === 'created_at' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            Date {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {filteredAndSortedSpots.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No cities found matching your search' : 'No cities tracked yet'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedSpots.map((spot) => (
            <CityRow key={spot.id} spot={spot} weather={weatherData?.[spot.id] || null} />
          ))}
        </div>
      )}
    </div>
  );
}

