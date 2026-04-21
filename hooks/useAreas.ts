import { useQuery } from "@tanstack/react-query";
import { type IAreaPopulated, getAreas } from "@/actions/area.action";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchAreas() {
	return useQuery<IAreaPopulated[]>({
		queryKey: [queryKeys.areas],
		queryFn: getAreas,
		staleTime: 5 * 60 * 1000,
	});
}
