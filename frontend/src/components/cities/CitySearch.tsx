import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Input } from '../ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import type { GeocodingResult } from '@/types/weather.types';

interface CitySearchProps {
  onSelect: (result: GeocodingResult) => void;
  value?: string;
}

export default function CitySearch({ onSelect, value: initialValue }: CitySearchProps) {
  const [query, setQuery] = useState(initialValue || '');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const { data: results = [], isLoading } = useQuery<GeocodingResult[]>({
    queryKey: ['geocoding', debouncedQuery],
    queryFn: () => api.get<GeocodingResult[]>(`/api/geocoding/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    setQuery(`${result.name}, ${result.country}`);
    setShowResults(false);
    onSelect(result);
  };

  return (
    <div ref={searchRef} className="relative">
      <Input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
      />
      {showResults && debouncedQuery.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No results found</div>
          ) : (
            results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-2 hover:bg-accent focus:bg-accent focus:outline-none"
              >
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-muted-foreground">
                  {result.state && `${result.state}, `}
                  {result.country}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

