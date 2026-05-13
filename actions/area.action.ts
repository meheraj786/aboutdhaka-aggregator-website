"use server";

import type { AnyBulkWriteOperation } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Area } from "@/models/area.model";
import type { CreateAreaInput } from "@/validators/areas";

export interface IBus {
	_id: string;
	busName: string;
}

export interface IBusStop {
	_id: string;
	stopName: string;
	area: string;
	location: {
		type: "Point";
		coordinates: [number, number];
	};
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

export async function getAreas(params?: GetAreasParams) {
	try {
		await dbConnect();

		if (!params) {
			const areas = await Area.find({})
				.sort({ name: 1 })
				.populate("buses")
				.populate("stops.buses")
				.populate("stops.stop")
				.lean();
			return serializeData(areas as unknown as IAreaPopulated[]);
		}

		const skip = (params.page - 1) * params.pageSize;
		const query = params.search
			? { name: { $regex: params.search, $options: "i" } }
			: {};

		const [items, totalCount] = await Promise.all([
			Area.find(query)
				.sort({ name: 1 })
				.skip(skip)
				.limit(params.pageSize)
				.populate("buses")
				.populate("stops.buses")
				.populate("stops.stop")
				.lean(),
			Area.countDocuments(query),
		]);

		return {
			items: serializeData(items as unknown as IAreaPopulated[]),
			totalCount,
			currentPage: params.page,
			totalPages: Math.ceil(totalCount / params.pageSize),
		};
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

export async function createArea(data: CreateAreaInput) {
	try {
		await dbConnect();
		const area = await Area.create(data);

		revalidatePath("/dashboard/areas");
		return serializeData(area.toObject());
	} catch (error) {
		console.error("Error creating area:", error);
		throw new Error("Failed to create area");
	}
}

export async function updateArea(id: string, data: CreateAreaInput) {
	try {
		await dbConnect();
		const area = await Area.findByIdAndUpdate(id, data, { new: true });

		revalidatePath("/dashboard/areas");
		return serializeData(area.toObject());
	} catch (error) {
		console.error("Error updating area:", error);
		throw new Error("Failed to update area");
	}
}

export async function deleteArea(id: string) {
	try {
		await dbConnect();
		await Area.findByIdAndDelete(id);

		revalidatePath("/dashboard/areas");
		return { success: true };
	} catch (error) {
		console.error("Error deleting area:", error);
		throw new Error("Failed to delete area");
	}
}
