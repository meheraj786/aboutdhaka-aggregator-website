import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createRestaurant,
	deleteRestaurant,
	type GetRestaurantsParams,
	getRestaurantById,
	getRestaurants,
	updateRestaurant,
} from "@/actions/restaurants.action";
import { queryKeys } from "@/lib/queryKeys";
import type { createRestaurantSchema } from "@/validators/restaurants";
import type { z } from "zod";

type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

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
		mutationFn: (data: CreateRestaurantInput) => createRestaurant(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.restaurants] });
		},
	});
}

export function useDeleteRestaurant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteRestaurant(id),
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

export function useUpdateRestaurant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<CreateRestaurantInput> }) =>
			updateRestaurant(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.restaurants] });
		},
	});
}