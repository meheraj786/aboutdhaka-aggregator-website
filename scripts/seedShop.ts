// scripts/seed-places.ts
import mongoose from "mongoose";
import { Place } from "@/models/places.model";

const placesSeed = [
	{
		name: "Bangabandhu Memorial Museum",
		area: "69e767140e6ed07954f4e00b",
		location: "Dhanmondi 32, Dhaka",
		category: "Museum",
		detail: "Former residence of Sheikh Mujibur Rahman, now a national museum.",
		rating: 4.6,
		reviews: 380,
		fee: 10,
		contact: "+880 2-9668150",
		facilities: ["Museum", "Historical", "Garden"],
		gps: { type: "Point", coordinates: [90.3810, 23.7420] },
	},
	{
		name: "Curzon Hall",
		area: "69e767140e6ed07954f4e023",
		location: "University of Dhaka Campus",
		category: "Architectural Landmark",
		detail: "Iconic red-brick colonial building with Mughal influence.",
		rating: 4.4,
		reviews: 240,
		fee: 0,
		facilities: ["Architecture", "Campus", "Photography"],
		gps: { type: "Point", coordinates: [90.3980, 23.7280] },
	},
	{
		name: "Baldha Garden",
		area: "69e767140e6ed07954f4e026",
		location: "Wari, Old Dhaka",
		category: "Botanical Garden",
		detail: "One of the oldest botanical gardens in Bangladesh.",
		rating: 4.2,
		reviews: 210,
		fee: 10,
		facilities: ["Garden", "Botanical", "Walking"],
		gps: { type: "Point", coordinates: [90.4250, 23.7100] },
	},
	{
		name: "Sher-e-Bangla Cricket Stadium",
		area: "69e767140e6ed07954f4e018",
		location: "Mirpur, Dhaka",
		category: "Sports Venue",
		detail: "Home of Bangladesh National Cricket Team.",
		rating: 4.5,
		reviews: 650,
		fee: 0,
		facilities: ["Cricket", "Sports"],
		gps: { type: "Point", coordinates: [90.3630, 23.8100] },
	},
	{
		name: "Dhanmondi Lake Park",
		area: "69e767140e6ed07954f4e00b",
		location: "Dhanmondi, Dhaka",
		category: "Lake Park",
		detail: "Popular recreational lake with walking track.",
		rating: 4.3,
		reviews: 340,
		fee: 0,
		facilities: ["Lake", "Walking", "Boating"],
		gps: { type: "Point", coordinates: [90.3800, 23.7450] },
	},
	{
		name: "Gulshan Lake Park",
		area: "69e767140e6ed07954f4e00d",
		location: "Gulshan 2",
		category: "Lake Park",
		detail: "Scenic lake park in upscale Gulshan area.",
		rating: 4.2,
		reviews: 280,
		fee: 0,
		facilities: ["Lake", "Walking"],
		gps: { type: "Point", coordinates: [90.4180, 23.7950] },
	},
	{
		name: "Hussaini Dalan",
		area: "69e767140e6ed07954f4e016",
		location: "Old Dhaka",
		category: "Religious Site",
		detail: "Historic Shia Imambara and shrine.",
		rating: 4.3,
		reviews: 180,
		fee: 0,
		facilities: ["Shrine"],
		gps: { type: "Point", coordinates: [90.4080, 23.7150] },
	},
	{
		name: "Kakrail Mosque",
		area: "69e767140e6ed07954f4e01e",
		location: "Kakrail, Ramna",
		category: "Religious Site",
		detail: "Large modern mosque in central Dhaka.",
		rating: 4.3,
		reviews: 150,
		fee: 0,
		facilities: ["Mosque"],
		gps: { type: "Point", coordinates: [90.4100, 23.7350] },
	},
	{
		name: "Mukti Juddho Smriti Museum",
		area: "69e767140e6ed07954f4e018",
		location: "Mirpur",
		category: "Museum",
		detail: "Dedicated to the martyrs of the 1971 Liberation War.",
		rating: 4.4,
		reviews: 190,
		fee: 10,
		facilities: ["Museum"],
		gps: { type: "Point", coordinates: [90.3650, 23.8100] },
	},
	{
		name: "New Market Dhaka",
		area: "69e767140e6ed07954f4e01c",
		location: "New Market",
		category: "Market",
		detail: "Historic and bustling shopping market.",
		rating: 4.2,
		reviews: 520,
		fee: 0,
		facilities: ["Shopping", "Street Food"],
		gps: { type: "Point", coordinates: [90.4000, 23.7300] },
	},
	{
		name: "Farmgate Market",
		area: "69e767140e6ed07954f4e00c",
		location: "Farmgate",
		category: "Market",
		detail: "Famous wholesale vegetable and fruit market.",
		rating: 4.0,
		reviews: 280,
		fee: 0,
		facilities: ["Market", "Local Life"],
		gps: { type: "Point", coordinates: [90.3900, 23.7580] },
	},
	{
		name: "Niketan Park",
		area: "69e767140e6ed07954f4e00d",
		location: "Niketan, Gulshan",
		category: "Park",
		detail: "Quiet residential park in Gulshan.",
		rating: 4.1,
		reviews: 130,
		fee: 0,
		facilities: ["Park"],
		gps: { type: "Point", coordinates: [90.4150, 23.7850] },
	},
	{
		name: "Jatiya Press Club",
		area: "69e767140e6ed07954f4e01e",
		location: "Paltan",
		category: "Cultural",
		detail: "Historic press club of Bangladesh.",
		rating: 4.2,
		reviews: 95,
		fee: 0,
		facilities: ["Cultural"],
		gps: { type: "Point", coordinates: [90.4100, 23.7280] },
	},
	{
		name: "BUET Central Playground",
		area: "69e767140e6ed07954f4e023",
		location: "BUET Campus",
		category: "Recreational",
		detail: "Popular open field inside BUET campus.",
		rating: 4.3,
		reviews: 140,
		fee: 0,
		facilities: ["Sports", "Campus"],
		gps: { type: "Point", coordinates: [90.3900, 23.7260] },
	}
];



async function seedPlaces() {
	try {
		await mongoose.connect(
			"mongodb+srv://meherajhosen786_db_user:hossen5799raj@primary.ydl4rgk.mongodb.net/dhaka-aggregator"
		);
		console.log("✅ MongoDB Connected");

		let insertedCount = 0;

		for (const place of placesSeed) {
			const existing = await Place.findOne({ name: place.name });
			if (existing) {
				console.log(`⚠️ Already exists: ${place.name}`);
				continue;
			}

			await Place.create(place);
			insertedCount++;
			console.log(`✅ Added: ${place.name}`);
		}

		console.log(`🎉 Successfully seeded ${insertedCount} tourist places!`);
	} catch (error: any) {
		console.error("❌ Seeding failed:", error.message);
	} finally {
		await mongoose.disconnect();
	}
}

seedPlaces();