import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { WeatherSpot, CreateSpotInput, UpdateSpotInput } from '../types/spots.types';

const SPOTS_QUERY_KEY = ['spots'];

export function useSpots() {
  return useQuery<WeatherSpot[]>({
    queryKey: SPOTS_QUERY_KEY,
    queryFn: () => api.get<WeatherSpot[]>('/api/spots'),
  });
}

export function useSpot(id: string) {
  return useQuery<WeatherSpot>({
    queryKey: [...SPOTS_QUERY_KEY, id],
    queryFn: () => api.get<WeatherSpot>(`/api/spots/${id}`),
    enabled: !!id,
  });
}

export function useCreateSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSpotInput) => api.post<WeatherSpot>('/api/spots', input),
    onMutate: async (newSpot) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: SPOTS_QUERY_KEY });

      // Snapshot previous value
      const previousSpots = queryClient.getQueryData<WeatherSpot[]>(SPOTS_QUERY_KEY);

      // Optimistically update
      if (previousSpots) {
        const optimisticSpot: WeatherSpot = {
          id: 'temp-' + Date.now(),
          ...newSpot,
          country_code: newSpot.country_code || null,
          is_favorite: newSpot.is_favorite || false,
          notes: newSpot.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        queryClient.setQueryData<WeatherSpot[]>(SPOTS_QUERY_KEY, [...previousSpots, optimisticSpot]);
      }

      return { previousSpots };
    },
    onError: (err, newSpot, context) => {
      // Rollback on error
      if (context?.previousSpots) {
        queryClient.setQueryData(SPOTS_QUERY_KEY, context.previousSpots);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPOTS_QUERY_KEY });
    },
  });
}

export function useUpdateSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSpotInput }) =>
      api.patch<WeatherSpot>(`/api/spots/${id}`, input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: SPOTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...SPOTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/api/spots/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPOTS_QUERY_KEY });
    },
  });
}

