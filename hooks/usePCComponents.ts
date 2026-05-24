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

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "object" && error !== null && "message" in error) {
		const msg = (error as Record<string, unknown>).message;
		return typeof msg === "string" ? msg : "An error occurred";
	}
	return "An error occurred";
}

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
		queryFn: () => {
			if (!query) return Promise.resolve([]);
			return getSuggestedBuild(query);
		},
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
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
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
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
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
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
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
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
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
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
	});
}
