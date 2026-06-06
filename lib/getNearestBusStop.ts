import { BusStop } from "@/models/stop.model";

async function getNearestBusStop(
	userLocation: [number, number],
	maxDistance = 1500,
) {
	return await BusStop.find({
		location: {
			$near: {
				$geometry: {
					type: "Point",
					coordinates: userLocation,
				},
				$maxDistance: maxDistance,
			},
		},
	})
		.limit(3)
		.select("stopName area location");
}

export default getNearestBusStop;
