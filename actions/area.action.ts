"use server";

import { dbConnect } from "@/lib/db";
import { Area } from "@/models/area.model";

// Helper function to serialize ObjectIds and plain objects for client transport
function serializeData(data: unknown): unknown {
	if (data === null || data === undefined) {
		return data;
	}

	// Handle ObjectId - check if it's a Mongoose ObjectId instance
	if (
		typeof data === "object" &&
		"toString" in data &&
		"constructor" in data &&
		typeof (data as Record<string, unknown>).toString === "function" &&
		(data as Record<string, unknown>).constructor.name === "ObjectId"
	) {
		return (data as { toString(): string }).toString();
	}

	// Handle Date
	if (data instanceof Date) {
		return data.toISOString();
	}

	// Handle arrays
	if (Array.isArray(data)) {
		return data.map(serializeData);
	}

	// Handle objects
	if (typeof data === "object") {
		const result: Record<string, unknown> = {};
		for (const key in data) {
			if (Object.hasOwn(data, key)) {
				result[key] = serializeData((data as Record<string, unknown>)[key]);
			}
		}
		return result;
	}

	// Return primitives as-is
	return data;
}

export async function getAreas() {
	try {
		await dbConnect();
		const areas = await Area.find({})
			.sort({ name: 1 })
			.populate("buses")
			.populate("stops.buses")
			.populate("stops.stop")
			.lean();

		// Serialize all ObjectIds to strings for client transport
		return serializeData(areas);
	} catch (error) {
		console.error("Error fetching areas:", error);
		throw new Error("Failed to fetch areas");
	}
}

const AREA_SEED_DATA = [
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
			}, // Shankar
			{
				stop: "69e738015548584ada29d285",
				buses: ["69e738805548584ada29d28f", "69e738805548584ada29d291"],
			}, // Jigatola
			{
				stop: "69e738015548584ada29d288",
				buses: ["69e738805548584ada29d28e", "69e738805548584ada29d293"],
			}, // Kalabagan
			{
				stop: "69e738015548584ada29d289",
				buses: ["69e738805548584ada29d28f", "69e738805548584ada29d290"],
			}, // Dhanmondi 15
			{
				stop: "69e738015548584ada29d28a",
				buses: ["69e738805548584ada29d28e", "69e738805548584ada29d293"],
			}, // Sukrabad
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
			}, // City College
			{
				stop: "69e738015548584ada29d287",
				buses: ["69e738805548584ada29d290", "69e738805548584ada29d291"],
			}, // Science Lab
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

const REMAINING_AREAS = [
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

export async function seedAreas() {
	try {
		await dbConnect();

		const seedOperations = AREA_SEED_DATA.map((data) => ({
			updateOne: {
				filter: { name: data.name },
				update: { $set: data },
				upsert: true,
			},
		}));

		const remainingOperations = REMAINING_AREAS.map((name) => ({
			updateOne: {
				filter: { name: name },
				update: { $setOnInsert: { name, buses: [], stops: [] } },
				upsert: true,
			},
		}));

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
