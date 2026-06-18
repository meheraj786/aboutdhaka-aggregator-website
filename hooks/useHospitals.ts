import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createHospital,
	deleteHospital,
	type GetHospitalsParams,
	getHospitalById,
	getHospitals,
	updateHospital,
	getRandomHospitals,
} from "@/actions/hospital.action";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchHospitals(params: GetHospitalsParams = {}) {
	return useQuery({
		queryKey: [queryKeys.hospitals, "get", params],
		queryFn: () => getHospitals(params),
		placeholderData: (prev) => prev,
	});
}

export type UseFetchHospitalsResponse = Awaited<
	ReturnType<typeof getHospitals>
>;

export const useFetchHospitalById = (id: string) => {
	return useQuery({
		queryKey: [queryKeys.hospitals, id],
		queryFn: async () => {
			return await getHospitalById(id);
		},
		enabled: !!id,
	});
};

export function useCreateHospital() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createHospital,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.hospitals] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create hospital");
		},
	});
}

export function useDeleteHospital() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteHospital,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.hospitals] });
			toast.success("Hospital deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete hospital");
		},
	});
}

export function useUpdateHospital() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: unknown }) =>
			updateHospital(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.hospitals] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update hospital");
		},
	});
}

export function useFetchRandomHospitals() {
	return useQuery({
		queryKey: [queryKeys.hospitals, "random"],
		queryFn: () => getRandomHospitals(4),
		staleTime: 0,
		gcTime: 0,
	});
}

