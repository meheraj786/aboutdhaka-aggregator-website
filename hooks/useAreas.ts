import { useQuery } from "@tanstack/react-query";
import { getAreas } from "@/actions/area.action";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchAreas() {
	return useQuery({
		queryKey: [queryKeys.areas],
		queryFn: getAreas,
		staleTime: 5 * 60 * 1000,
	});
}
