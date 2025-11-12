import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { WeatherRecord } from '../types/weather.types';

const WEATHER_QUERY_KEY = ['weather'];

export function useWeather(spotId: string, options?: { forceRefresh?: boolean }) {
  return useQuery<WeatherRecord>({
    queryKey: [...WEATHER_QUERY_KEY, spotId],
    queryFn: () => {
      const url = `/api/spots/${spotId}/weather${options?.forceRefresh ? '?refresh=true' : ''}`;
      return api.get<WeatherRecord>(url);
    },
    enabled: !!spotId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useWeatherHistory(spotId: string, days: number = 7) {
  return useQuery<WeatherRecord[]>({
    queryKey: [...WEATHER_QUERY_KEY, spotId, 'history', days],
    queryFn: () => api.get<WeatherRecord[]>(`/api/spots/${spotId}/history?days=${days}`),
    enabled: !!spotId,
  });
}

export function useRefreshWeather() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (spotId: string) => api.post<WeatherRecord>(`/api/spots/${spotId}/weather`),
    onSuccess: (data, spotId) => {
      queryClient.setQueryData([...WEATHER_QUERY_KEY, spotId], data);
      queryClient.invalidateQueries({ queryKey: [...WEATHER_QUERY_KEY, spotId, 'history'] });
    },
  });
}

export function useBatchWeather(forceRefresh: boolean = false) {
  return useQuery<Record<string, WeatherRecord | null>>({
    queryKey: [...WEATHER_QUERY_KEY, 'batch', forceRefresh],
    queryFn: () => {
      const url = `/api/weather/batch${forceRefresh ? '?refresh=true' : ''}`;
      return api.get<Record<string, WeatherRecord | null>>(url);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

