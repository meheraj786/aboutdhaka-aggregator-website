import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createArea,
	deleteArea,
	type GetAreasParams,
	getAreas,
	type IAreaPopulated,
	updateArea,
} from "@/actions/area.action";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateAreaInput } from "@/validators/areas";

export function useFetchAreas() {
	return useQuery<IAreaPopulated[]>({
		queryKey: [queryKeys.areas],
		queryFn: () => getAreas() as Promise<IAreaPopulated[]>,
		staleTime: 5 * 60 * 1000,
	});
}

export function useFetchPaginatedAreas(params: GetAreasParams) {
	return useQuery({
		queryKey: [queryKeys.areas, params],
		queryFn: () =>
			getAreas(params) as Promise<{
				items: IAreaPopulated[];
				totalCount: number;
				currentPage: number;
				totalPages: number;
			}>,
	});
}

export function useCreateArea() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createArea,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.areas] });
			toast.success("Area created successfully");
		},
		onError: (error: { message: string }) => toast.error(error.message),
	});
}

export function useUpdateArea() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateAreaInput }) =>
			updateArea(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.areas] });
			toast.success("Area updated successfully");
		},
		onError: (error: { message: string }) => toast.error(error.message),
	});
}

export function useDeleteArea() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteArea,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.areas] });
			toast.success("Area deleted");
		},
		onError: (error: { message: string }) => toast.error(error.message),
	});
}
