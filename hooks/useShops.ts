import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createShop,
	deleteShop,
	getShops,
	type IShopPopulated,
	updateShop,
} from "@/actions/shop.action";
import { queryKeys } from "@/lib/queryKeys";
import type { ShopInput } from "@/validators/shops";

export type { IShopPopulated };

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "object" && error !== null && "message" in error) {
		const msg = (error as Record<string, unknown>).message;
		return typeof msg === "string" ? msg : "An error occurred";
	}
	return "An error occurred";
}

export function useFetchShops() {
	return useQuery<IShopPopulated[]>({
		queryKey: [queryKeys.shops],
		queryFn: getShops,
		staleTime: 10 * 60 * 1000,
	});
}

export function useCreateShop() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createShop,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.shops] });
			toast.success("Shop added");
		},
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
	});
}

export function useUpdateShop() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ShopInput }) =>
			updateShop(id, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.shops] });
			toast.success("Shop updated");
		},
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
	});
}

export function useDeleteShop() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: deleteShop,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [queryKeys.shops] });
			toast.success("Shop deleted");
		},
		onError: (e: unknown) => toast.error(getErrorMessage(e)),
	});
}
