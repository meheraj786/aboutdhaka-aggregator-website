import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createPlace,
	deletePlace,
	getPlaceById,
	getPlaces,
	updatePlace,
} from "@/actions/place.action";
import type { UpdatePlaceInput } from "@/validators/places";

export function useFetchPlaces() {
	return useQuery({
		queryKey: ["places", "get"],
		queryFn: async () => {
			return await getPlaces();
		},
	});
}

export function useFetchPlaceById(id: string) {
	return useQuery({
		queryKey: ["place", id],
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
			queryClient.invalidateQueries({ queryKey: ["places", "get"] });
		},
	});
}

export function useUpdatePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdatePlaceInput }) =>
			updatePlace(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["places", "get"] });
		},
	});
}

export function useDeletePlace() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePlace,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["places", "get"] });
		},
	});
}
