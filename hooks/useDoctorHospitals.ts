import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createDoctorHospital,
	deleteDoctorHospital,
	type GetDoctorHospitalsParams,
	getDoctorHospitals,
	updateDoctorHospital,
} from "@/actions/doctorHospital.action";
import { queryKeys } from "@/lib/queryKeys";
import type { UpdateDoctorHospitalInput } from "@/validators/doctorHospitals";

export function useFetchDoctorHospitals(
	params: GetDoctorHospitalsParams = {},
	enabled = true,
) {
	return useQuery({
		queryKey: [queryKeys.doctorHospitals, "get", params],
		queryFn: () => getDoctorHospitals(params),
		placeholderData: (prev) => prev,
		enabled,
	});
}

export function useCreateDoctorHospital() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createDoctorHospital,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [queryKeys.doctorHospitals, "get"],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to add assignment");
		},
	});
}

export function useUpdateDoctorHospital() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateDoctorHospitalInput;
		}) => updateDoctorHospital(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [queryKeys.doctorHospitals, "get"],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update assignment");
		},
	});
}

export function useDeleteDoctorHospital() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteDoctorHospital,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [queryKeys.doctorHospitals, "get"],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete assignment");
		},
	});
}
