import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createDoctor,
	deleteDoctor,
	type GetDoctorsParams,
	getDoctorById,
	getDoctors,
	updateDoctor,
} from "@/actions/doctor.action";
import { queryKeys } from "@/lib/queryKeys";
import type { UpdateDoctorInput } from "@/validators/doctors";

export function useFetchDoctors(params: GetDoctorsParams = {}) {
	return useQuery({
		queryKey: [queryKeys.doctors, "get", params],
		queryFn: () => getDoctors(params),
		placeholderData: (prev) => prev,
	});
}

export function useFetchDoctorById(id: string) {
	return useQuery({
		queryKey: [queryKeys.doctors, id],
		queryFn: async () => {
			return await getDoctorById(id);
		},
		enabled: !!id,
	});
}

export function useCreateDoctor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createDoctor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.doctors, "get"] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create doctor");
		},
	});
}

export function useUpdateDoctor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateDoctorInput }) =>
			updateDoctor(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.doctors, "get"] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update doctor");
		},
	});
}

export function useDeleteDoctor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteDoctor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.doctors, "get"] });
			toast.success("Doctor deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete doctor");
		},
	});
}
