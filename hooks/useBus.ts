import { useQuery } from "@tanstack/react-query";
import { findBusRoutes } from "@/actions/bus.action";
import { queryKeys } from "@/lib/queryKeys";

export function useFindBusRoutes(
	departureStopId: string,
	destinationStopId: string,
) {
	return useQuery({
		queryKey: [queryKeys.busRoutes, departureStopId, destinationStopId],
		queryFn: () => findBusRoutes(departureStopId, destinationStopId),
		enabled: !!departureStopId && !!destinationStopId,
		placeholderData: (prev) => prev,
		staleTime: 1000 * 60 * 5,
	});
}

export type UseFindBusRoutesResponse = Awaited<
	ReturnType<typeof findBusRoutes>
>;
