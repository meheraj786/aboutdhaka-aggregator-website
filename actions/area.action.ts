"use server";

import type { AnyBulkWriteOperation } from "mongodb";
import { dbConnect } from "@/lib/db";
import { Area } from "@/models/area.model";

interface IBus {
	_id: string;
	busName: string;
}

interface IBusStop {
	_id: string;
	stopName: string;
	area: string;
}

interface IAreaStop {
	stop: IBusStop;
	buses: IBus[];
	_id: string;
}

export interface IAreaPopulated {
	_id: string;
	name: string;
	buses: IBus[];
	stops: IAreaStop[];
	createdAt: string;
	updatedAt: string;
}

interface ISeedData {
	name: string;
	buses: string[];
	stops: {
		stop: string;
		buses: string[];
	}[];
}

function serializeData<T>(data: T): T {
	if (data === null || data === undefined) {
		return data;
	}

	if (
		typeof data === "object" &&
		data.constructor &&
		data.constructor.name === "ObjectId"
	) {
		return (data as { toString(): string }).toString() as unknown as T;
	}

	if (data instanceof Date) {
		return data.toISOString() as unknown as T;
	}

	if (Array.isArray(data)) {
		return data.map(serializeData) as unknown as T;
	}

	if (typeof data === "object") {
		const result: Record<string, unknown> = {};
		for (const key in data) {
			if (Object.hasOwn(data, key)) {
				result[key] = serializeData((data as Record<string, unknown>)[key]);
			}
		}
		return result as T;
	}

	return data;
}

export async function getAreas(): Promise<IAreaPopulated[]> {
	try {
		await dbConnect();
		const areas = await Area.find({})
			.sort({ name: 1 })
			.populate("buses")
			.populate("stops.buses")
			.populate("stops.stop")
			.lean();

		return serializeData(areas as unknown as IAreaPopulated[]);
	} catch (error) {
		console.error("Error fetching areas:", error);
		throw new Error("Failed to fetch areas");
	}
}

const AREA_SEED_DATA: ISeedData[] = [
	{
		name: "Dhanmondi",
		buses: [
			"69e738805548584ada29d28e",
			"69e738805548584ada29d28f",
			"69e738805548584ada29d290",
			"69e738805548584ada29d291",
			"69e738805548584ada29d293",
		],
		stops: [
			{
				stop: "69e738015548584ada29d284",
				buses: ["69e738805548584ada29d28f", "69e738805548584ada29d290"],
			},
			{
				stop: "69e738015548584ada29d285",
				buses: ["69e738805548584ada29d28f", "69e738805548584ada29d291"],
			},
			{
				stop: "69e738015548584ada29d288",
				buses: ["69e738805548584ada29d28e", "69e738805548584ada29d293"],
			},
			{
				stop: "69e738015548584ada29d289",
				buses: ["69e738805548584ada29d28f", "69e738805548584ada29d290"],
			},
			{
				stop: "69e738015548584ada29d28a",
				buses: ["69e738805548584ada29d28e", "69e738805548584ada29d293"],
			},
		],
	},
	{
		name: "Science Lab",
		buses: [
			"69e738805548584ada29d28e",
			"69e738805548584ada29d28f",
			"69e738805548584ada29d290",
			"69e738805548584ada29d291",
		],
		stops: [
			{
				stop: "69e738015548584ada29d286",
				buses: ["69e738805548584ada29d28e", "69e738805548584ada29d28f"],
			},
			{
				stop: "69e738015548584ada29d287",
				buses: ["69e738805548584ada29d290", "69e738805548584ada29d291"],
			},
		],
	},
	{
		name: "Mirpur",
		buses: ["69e738805548584ada29d28f", "69e738805548584ada29d290"],
		stops: [
			{ stop: "69e738015548584ada29d301", buses: ["69e738805548584ada29d28f"] },
			{ stop: "69e738015548584ada29d302", buses: ["69e738805548584ada29d290"] },
		],
	},
	{
		name: "Uttara",
		buses: ["69e738805548584ada29d28f", "69e738805548584ada29d293"],
		stops: [
			{ stop: "69e738015548584ada29d303", buses: ["69e738805548584ada29d28f"] },
			{ stop: "69e738015548584ada29d304", buses: ["69e738805548584ada29d293"] },
		],
	},
	{
		name: "Badda",
		buses: ["69e738805548584ada29d291"],
		stops: [
			{ stop: "69e738015548584ada29d305", buses: ["69e738805548584ada29d291"] },
		],
	},
];

const REMAINING_AREAS: string[] = [
	"Adabor",
	"Bangsal",
	"Bimanbandar",
	"Cantonment",
	"Chawkbazar",
	"Dakshinkhan",
	"Darus Salam",
	"Demra",
	"Gendaria",
	"Gulshan",
	"Hazaribagh",
	"Jatrabari",
	"Kadamtali",
	"Kafrul",
	"Kamrangirchar",
	"Khilgaon",
	"Khilkhet",
	"Kotwali",
	"Lalbagh",
	"Mohammadpur",
	"Motijheel",
	"Mugda",
	"New Market",
	"Pallabi",
	"Paltan",
	"Ramna",
	"Rampura",
	"Sabujbagh",
	"Shah Ali",
	"Shahbagh",
	"Sher-e-Bangla Nagar",
	"Shyampur",
	"Sutrapur",
	"Tejgaon",
	"Tejgaon Industrial Area",
	"Turag",
	"Uttar Khan",
	"Vatara",
	"Wari",
];

export async function seedAreas(): Promise<{
	success: boolean;
	message: string;
}> {
	try {
		await dbConnect();

		const seedOperations: AnyBulkWriteOperation[] = AREA_SEED_DATA.map(
			(data) => ({
				updateOne: {
					filter: { name: data.name },
					update: { $set: data },
					upsert: true,
				},
			}),
		);

		const remainingOperations: AnyBulkWriteOperation[] = REMAINING_AREAS.map(
			(name) => ({
				updateOne: {
					filter: { name: name },
					update: {
						$setOnInsert: { name, buses: [], stops: [] },
					},
					upsert: true,
				},
			}),
		);

		await Area.bulkWrite([...seedOperations, ...remainingOperations]);

		return {
			success: true,
			message: "Areas seeded successfully with Bus and Stop IDs.",
		};
	} catch (error) {
		console.error("Error seeding areas:", error);
		return { success: false, message: "Failed to seed areas." };
	}
}
