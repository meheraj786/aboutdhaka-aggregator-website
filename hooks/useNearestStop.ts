// hooks/useNearestStop.ts
// Pure client-side hook — only uses fetch, no mongoose/db imports

import { useQuery } from "@tanstack/react-query";

export interface NearestStopResult {
	stopId: string;
	areaId: string;
	stopName: string;
	distance: number; // meters
}

async function fetchNearestStop(
	lat: number,
	lng: number,
): Promise<NearestStopResult> {
	const res = await fetch(`/api/stops/nearest?lat=${lat}&lng=${lng}`);
	if (!res.ok) throw new Error("Failed to fetch nearest stop");
	const json = await res.json();
	return json.data;
}

export function useFindNearestStop(
	lat: number | undefined,
	lng: number | undefined,
) {
	return useQuery({
		queryKey: ["nearest-stop", lat, lng],
		queryFn: () => fetchNearestStop(lat || 0, lng || 0),
		enabled: lat !== undefined && lng !== undefined,
		staleTime: 1000 * 60 * 5,
	});
}
