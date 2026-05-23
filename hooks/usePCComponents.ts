import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createComponent,
	deleteComponent,
	type GetComponentsParams,
	getComponents,
	getSuggestedBuild,
	type IPCComponentPopulated,
	removeShopListing,
	type SuggestedBuild,
	type SuggestionQuery,
	updateComponent,
	upsertShopListing,
} from "@/actions/pcComponent.action";
import { queryKeys } from "@/lib/queryKeys";
import type { PCComponentInput } from "@/validators/pcComponent";

export function useFetchComponents() {
	return useQuery<IPCComponentPopulated[]>({
		queryKey: [queryKeys.pcComponents],
		queryFn: () => getComponents() as Promise<IPCComponentPopulated[]>,
		staleTime: 5 * 60 * 1000,
	});
}

export function useFetchPaginatedComponents(params: GetComponentsParams) {
	return useQuery({
		queryKey: [queryKeys.pcComponents, params],
		queryFn: () =>
			getComponents(params) as Promise<{
				items: IPCComponentPopulated[];
				totalCount: number;
				currentPage: number;
				totalPages: number;
			}>,
	});
}

export function useSuggestedBuild(query: SuggestionQuery | null) {
	return useQuery<SuggestedBuild[]>({
		queryKey: [queryKeys.pcComponents, "suggestion", query],
		queryFn: () => getSuggestedBuild(query),
		enabled: !!query,
		staleTime: 2 * 60 * 1000,
	});
}

export function useCreateComponent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createComponent,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.pcComponents] });
			toast.success("Component created");
		},
		onError: (e: { message: string }) => toast.error(e.message),
	});
}

export function useUpdateComponent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: PCComponentInput }) =>
			updateComponent(id, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.pcComponents] });
			toast.success("Component updated");
		},
		onError: (e: { message: string }) => toast.error(e.message),
	});
}

export function useDeleteComponent() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteComponent,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.pcComponents] });
			toast.success("Component deleted");
		},
		onError: (e: { message: string }) => toast.error(e.message),
	});
}

export function useUpsertShopListing() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			componentId,
			listing,
		}: {
			componentId: string;
			listing: { shop: string; price: number; stock: string; url?: string };
		}) => upsertShopListing(componentId, listing),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.pcComponents] });
			toast.success("Shop listing updated");
		},
		onError: (e: { message: string }) => toast.error(e.message),
	});
}

export function useRemoveShopListing() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			componentId,
			shopId,
		}: {
			componentId: string;
			shopId: string;
		}) => removeShopListing(componentId, shopId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.pcComponents] });
			toast.success("Shop listing removed");
		},
		onError: (e: { message: string }) => toast.error(e.message),
	});
}
