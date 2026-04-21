"use server";

import { dbConnect } from "@/lib/db";
import { Area } from "@/models/area.model";

interface AreaDocument {
	_id: { toString(): string };
	name: string;
	buses?: unknown[];
	stops?: unknown[];
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
		return (areas as AreaDocument[]).map(({ _id, name, buses, stops }) => ({
			_id: _id.toString(),
			name,
			buses: buses || [],
			stops: stops || [],
		}));
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
			{ stop: "69e738015548584ada29d301", buses: ["69e738805548584ada29d28f"] }, // Mock: Mirpur 10
			{ stop: "69e738015548584ada29d302", buses: ["69e738805548584ada29d290"] }, // Mock: Mirpur 1
		],
	},
	{
		name: "Uttara",
		buses: ["69e738805548584ada29d28f", "69e738805548584ada29d293"],
		stops: [
			{ stop: "69e738015548584ada29d303", buses: ["69e738805548584ada29d28f"] }, // Mock: House Building
			{ stop: "69e738015548584ada29d304", buses: ["69e738805548584ada29d293"] }, // Mock: Azampur
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

		// ১. প্রথমে AREA_SEED_DATA প্রসেস করা (যাদের স্টপ আছে)
		const seedOperations = AREA_SEED_DATA.map((data) => ({
			updateOne: {
				filter: { name: data.name },
				update: { $set: data },
				upsert: true,
			},
		}));

		// ২. বাকি এরিয়াগুলো যাদের ডাটা নেই তাদের প্রসেস করা
		const remainingOperations = REMAINING_AREAS.map((name) => ({
			updateOne: {
				filter: { name: name },
				update: { $setOnInsert: { name, buses: [], stops: [] } },
				upsert: true,
			},
		}));

		// BulkWrite চালানো যাতে সব ডাটা একসাথে সেভ হয়
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
