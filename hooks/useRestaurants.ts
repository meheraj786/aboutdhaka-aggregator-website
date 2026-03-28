import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createRestaurant,
	deleteRestaurant,
	type GetRestaurantsParams,
	getRestaurantById,
	getRestaurants,
} from "@/actions/restaurants.action";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchRestaurants(params: GetRestaurantsParams = {}) {
  return useQuery({
    queryKey: [queryKeys.restaurants, "get", params],
    queryFn: () => getRestaurants(params),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreateRestaurant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createRestaurant,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.restaurants] });
		},
	});
}

export function useDeleteRestaurant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteRestaurant,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.restaurants] });
		},
	});
}

export function useFetchRestaurantById(id: string) {
	return useQuery({
		queryKey: [queryKeys.restaurants, id],
		queryFn: async () => {
			return await getRestaurantById(id);
		},
		enabled: !!id,
	});
}
