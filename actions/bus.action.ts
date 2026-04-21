"use server";

import { dbConnect } from "@/lib/db";
import { Bus } from "@/models/buses.model";

// import { BusStop } from "@/models/stop.model";

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
) {
	try {
		await dbConnect();

		const allBuses = (await Bus.find({})
			.populate("stops")
			.lean()) as unknown as IBusWithStops[];

		const directBuses = allBuses.filter((bus: IBusWithStops) => {
			const hasDeparture = bus.stops.some(
				(s: IBusStop) => s._id.toString() === departureStopId,
			);
			const hasDestination = bus.stops.some(
				(s: IBusStop) => s._id.toString() === destinationStopId,
			);
			return hasDeparture && hasDestination;
		});

		if (directBuses.length > 0) {
			return {
				type: "direct",
				data: directBuses,
			};
		}

		const leg1Buses = allBuses.filter((bus: IBusWithStops) =>
			bus.stops.some((s: IBusStop) => s._id.toString() === departureStopId),
		);

		const leg2Buses = allBuses.filter((bus: IBusWithStops) =>
			bus.stops.some((s: IBusStop) => s._id.toString() === destinationStopId),
		);

		const connections: Array<{
			bus1: { name: string; _id: string };
			bus2: { name: string; _id: string };
			transferAt: IBusStop;
		}> = [];

		for (const bus1 of leg1Buses) {
			for (const bus2 of leg2Buses) {
				if (bus1._id.toString() === bus2._id.toString()) continue;

				const stop2Ids = bus2.stops.map((s: IBusStop) => s._id.toString());

				const transferStop = bus1.stops.find((stop: IBusStop) => {
					const sId = stop._id.toString();
					return (
						sId !== departureStopId &&
						sId !== destinationStopId &&
						stop2Ids.includes(sId)
					);
				});

				if (transferStop) {
					connections.push({
						bus1: { name: bus1.busName, _id: bus1._id.toString() },
						bus2: { name: bus2.busName, _id: bus2._id.toString() },
						transferAt: transferStop,
					});
					break;
				}
			}
		}

		const uniqueConnections = Array.from(
			new Map(
				connections.map((c) => [`${c.bus1._id}-${c.bus2._id}`, c]),
			).values(),
		);

		return {
			type: "connecting",
			data: uniqueConnections.slice(0, 10),
		};
	} catch (error) {
		console.error(error);
		throw new Error("Failed to find routes");
	}
}
