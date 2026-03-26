import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createPlace,
	deletePlace,
	getPlaceById,
	getPlaces,
	updatePlace,
	type GetPlacesParams,
} from "@/actions/place.action";
import type { UpdatePlaceInput } from "@/validators/places";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchPlaces(params: GetPlacesParams = {}) {
	return useQuery({
		queryKey: [queryKeys.places, "get", params],  
		queryFn: () => getPlaces(params),
		placeholderData: (prev) => prev,
	});
}

export function useFetchPlaceById(id: string) {
	return useQuery({
		queryKey: [queryKeys.places, id],
		queryFn: async () => {
			return await getPlaceById(id);
		},
		enabled: !!id,
	});
}

export function useCreatePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPlace,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.places, "get"] });
		},
	});
}

export function useUpdatePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdatePlaceInput }) =>
			updatePlace(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.places, "get"] });
		},
	});
}

export function useDeletePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePlace,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.places, "get"] });
		},
	});
}