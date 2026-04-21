"use server";

import { dbConnect } from "@/lib/db";
import { Bus } from "@/models/buses.model";

interface IBusStop {
	_id: string;
	stopName: string;
	area: string;
	location: {
		type: "Point";
		coordinates: [number, number];
	};
}

interface IBusWithStops {
	_id: string;
	busName: string;
	stops: IBusStop[];
}

export async function findBusRoutes(
	departureStopId: string,
	destinationStopId: string,
): Promise<{ type: string; data: IBusWithStops[] }> {
	try {
		await dbConnect();

		const allBuses = (await Bus.find({})
			.populate("stops")
			.lean()) as unknown as IBusWithStops[];

		const directBuses: IBusWithStops[] = [];

		for (const bus of allBuses) {
			let hasStart = false;
			let hasEnd = false;

			for (const stop of bus.stops) {
				if (stop._id.toString() === departureStopId) hasStart = true;
				if (stop._id.toString() === destinationStopId) hasEnd = true;
			}

			if (hasStart && hasEnd) {
				directBuses.push(bus);
			}
		}

		if (directBuses.length > 0) {
			return { type: "direct", data: directBuses };
		}

		const busesFromStart = allBuses.filter((bus) =>
			bus.stops.some((s) => s._id.toString() === departureStopId),
		);

		const busesToEnd = allBuses.filter((bus) =>
			bus.stops.some((s) => s._id.toString() === destinationStopId),
		);

		const results = [];
		const foundConnectionKeys = new Set();

		for (const bus1 of busesFromStart) {
			for (const bus2 of busesToEnd) {
				if (bus1._id.toString() === bus2._id.toString()) continue;

				for (const stopOfBus1 of bus1.stops) {
					const sId = stopOfBus1._id.toString();

					if (sId === departureStopId || sId === destinationStopId) continue;

					const isStopInBus2 = bus2.stops.some((s) => s._id.toString() === sId);

					if (isStopInBus2) {
						const connectionKey = `${bus1._id}-${bus2._id}`;

						if (!foundConnectionKeys.has(connectionKey)) {
							results.push({
								bus1: { name: bus1.busName, _id: bus1._id.toString() },
								bus2: { name: bus2.busName, _id: bus2._id.toString() },
								transferAt: stopOfBus1,
							});
							foundConnectionKeys.add(connectionKey);
						}
						break;
					}
				}
			}
		}

		return {
			type: "connecting",
			data: results.slice(0, 10),
		};
	} catch (error) {
		console.error("Error finding routes:", error);
		throw new Error("Failed to find routes");
	}
}
