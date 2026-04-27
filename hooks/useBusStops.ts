import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createBusStop,
	deleteBusStop,
	type GetBusStopsParams,
	getBusStops,
} from "@/actions/busStop";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchBusStops(params: GetBusStopsParams) {
	return useQuery({
		queryKey: ["bus-stops", params],
		queryFn: () => getBusStops(params),
	});
}

export function useCreateBusStop() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createBusStop,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bus-stops"] });
			queryClient.invalidateQueries({ queryKey: [queryKeys.areas] });
			toast.success("Bus stop created successfully");
		},
		onError: (error: { message: string }) => toast.error(error.message),
	});
}

export function useDeleteBusStop() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteBusStop,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bus-stops"] });
			queryClient.invalidateQueries({ queryKey: [queryKeys.areas] });
			toast.success("Bus stop deleted");
		},
		onError: (error: { message: string }) => toast.error(error.message),
	});
}
