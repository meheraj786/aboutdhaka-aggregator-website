import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { seedAreas } from "@/actions/area.action";
import { queryKeys } from "@/lib/queryKeys";

export function useSeedAreas() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: seedAreas,
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message);
				queryClient.invalidateQueries({ queryKey: [queryKeys.areas] });
			} else {
				toast.error(data.message);
			}
		},
		onError: () => {
			toast.error("An unexpected error occurred while seeding areas.");
		},
	});
}
