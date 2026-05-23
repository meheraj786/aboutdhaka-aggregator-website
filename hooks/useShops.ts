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
import type { ShopInput } from "@/validators/pcComponent";

export type { IShopPopulated };

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
		onError: (e: { message: string }) => toast.error(e.message),
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
		onError: (e: { message: string }) => toast.error(e.message),
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
		onError: (e: { message: string }) => toast.error(e.message),
	});
}
