import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createMedicalCategory,
	deleteMedicalCategory,
	type GetMedicalCategoriesParams,
	getMedicalCategories,
	getMedicalCategoryById,
	updateMedicalCategory,
} from "@/actions/medicalCategories.action";
import { queryKeys } from "@/lib/queryKeys";
import type { UpdateMedicalCategoryInput } from "@/validators/medicalCategories";

export function useFetchMedicalCategories(
	params: GetMedicalCategoriesParams = {},
) {
	return useQuery({
		queryKey: [queryKeys.medicalCategories, "get", params],
		queryFn: () => getMedicalCategories(params),
		placeholderData: (prev) => prev,
	});
}

export function useFetchMedicalCategoryById(id: string) {
	return useQuery({
		queryKey: [queryKeys.medicalCategories, id],
		queryFn: async () => {
			return await getMedicalCategoryById(id);
		},
		enabled: !!id,
	});
}

export function useCreateMedicalCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createMedicalCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [queryKeys.medicalCategories, "get"],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create medical category");
		},
	});
}

export function useUpdateMedicalCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateMedicalCategoryInput;
		}) => updateMedicalCategory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [queryKeys.medicalCategories, "get"],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update medical category");
		},
	});
}

export function useDeleteMedicalCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteMedicalCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [queryKeys.medicalCategories, "get"],
			});
			toast.success("Medical category deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete medical category");
		},
	});
}
