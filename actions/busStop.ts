"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Area } from "@/models/area.model";
import { BusStop } from "@/models/stop.model";
import type { CreateBusStopInput } from "@/validators/busStops";

export type GetBusStopsParams = {
	page: number;
	pageSize: number;
	search?: string;
};

export async function createBusStop(data: CreateBusStopInput) {
	try {
		await dbConnect();

		// Step 1: Create the BusStop document
		const newStop = await BusStop.create({
			stopName: data.stopName,
			area: data.area,
			location: {
				type: "Point",
				coordinates: [Number(data.longitude), Number(data.latitude)],
			},
		});

		// Step 2: Find the Area by name and update its stops array
		await Area.findOneAndUpdate(
			{ name: data.area },
			{
				$push: {
					stops: {
						stop: newStop._id,
						buses: [],
					},
				},
			},
			{ new: true },
		);

		// Step 3: Revalidate both paths
		revalidatePath("/dashboard/bus-stops");
		revalidatePath("/bus");

		return JSON.parse(JSON.stringify(newStop));
	} catch (_error) {
		throw new Error("Failed to create bus stop");
	}
}

export async function getBusStops(params: GetBusStopsParams) {
	try {
		await dbConnect();
		const skip = (params.page - 1) * params.pageSize;
		const query = params.search
			? { stopName: { $regex: params.search, $options: "i" } }
			: {};

		const [items, totalCount] = await Promise.all([
			BusStop.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(params.pageSize)
				.lean(),
			BusStop.countDocuments(query),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: params.page,
			totalPages: Math.ceil(totalCount / params.pageSize),
		};
	} catch (_error) {
		throw new Error("Failed to fetch bus stops");
	}
}

export async function deleteBusStop(id: string) {
	try {
		await dbConnect();

		// Step 1: Get the BusStop to find which Area it belongs to
		const busStop = await BusStop.findById(id);
		if (!busStop) {
			throw new Error("Bus stop not found");
		}

		// Step 2: Delete the BusStop document
		await BusStop.findByIdAndDelete(id);

		// Step 3: Remove the stop from the Area's stops array
		await Area.findOneAndUpdate(
			{ name: busStop.area },
			{
				$pull: {
					stops: {
						stop: busStop._id,
					},
				},
			},
			{ new: true },
		);

		// Step 4: Revalidate both paths
		revalidatePath("/dashboard/bus-stops");
		revalidatePath("/bus");

		return { success: true };
	} catch (_error) {
		throw new Error("Failed to delete bus stop");
	}
}
