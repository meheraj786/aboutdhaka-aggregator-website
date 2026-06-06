// // scripts/seed-entry-level.ts
// import mongoose from "mongoose";
// import { PCComponent } from "@/models/pcComponent.model";

// const shopIds = {
// 	"Star Tech Ltd. - Multiplan Branch": "6a17052d3650bb8173606f35",
// 	"Star Tech Ltd. - IDB Branch": "6a17052d3650bb8173606f3c",
// 	"Ryans Computers - Multiplan Centre": "6a17052d3650bb8173606f36",
// 	"Ryans Computers - IDB Bhaban": "6a17052d3650bb8173606f3b",
// 	"Techland BD - Multiplan Branch": "6a17052d3650bb8173606f37",
// 	"Techland BD - Uttara Branch": "6a17052d3650bb8173606f3e",
// 	"PC House BD - Elephant Road": "6a17052d3650bb8173606f38",
// 	"Skyland Computer BD": "6a17052d3650bb8173606f39",
// 	"Creatus Computer - Multiplan": "6a17052d3650bb8173606f3a",
// 	"Computer Village - IDB": "6a17052d3650bb8173606f3d",
// };

// const entryLevelItems = [
// 	// ==================== ENTRY LEVEL PROCESSORS (10টা) ====================
// 	{
// 		name: "AMD Ryzen 5 5600G",
// 		brand: "AMD",
// 		category: "CPU",
// 		specs: {
// 			Cores: 6,
// 			Threads: 12,
// 			"Base Clock": "3.9 GHz",
// 			"Boost Clock": "4.4 GHz",
// 			TDP: "65W",
// 			Socket: "AM4",
// 			"Integrated Graphics": "Yes",
// 		},
// 		usageTags: ["Gaming", "Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		cores: 6,
// 		threads: 12,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{
// 				shop: shopIds["Star Tech Ltd. - Multiplan Branch"],
// 				price: 14800,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "AMD Ryzen 5 3400G",
// 		brand: "AMD",
// 		category: "CPU",
// 		specs: {
// 			Cores: 4,
// 			Threads: 8,
// 			"Base Clock": "3.7 GHz",
// 			"Boost Clock": "4.2 GHz",
// 			TDP: "65W",
// 			Socket: "AM4",
// 			"Integrated Graphics": "Yes",
// 		},
// 		usageTags: ["Office & Web", "Gaming"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		cores: 4,
// 		threads: 8,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{
// 				shop: shopIds["Techland BD - Multiplan Branch"],
// 				price: 10500,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "AMD Ryzen 5 2400G",
// 		brand: "AMD",
// 		category: "CPU",
// 		specs: {
// 			Cores: 4,
// 			Threads: 8,
// 			"Base Clock": "3.6 GHz",
// 			"Boost Clock": "3.9 GHz",
// 			TDP: "65W",
// 			Socket: "AM4",
// 			"Integrated Graphics": "Yes",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		cores: 4,
// 		threads: 8,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{
// 				shop: shopIds["Ryans Computers - IDB Bhaban"],
// 				price: 9200,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "Intel Core i3-12100F",
// 		brand: "Intel",
// 		category: "CPU",
// 		specs: {
// 			Cores: 4,
// 			Threads: 8,
// 			"Base Clock": "3.3 GHz",
// 			"Boost Clock": "4.3 GHz",
// 			TDP: "58W",
// 			Socket: "LGA1700",
// 		},
// 		usageTags: ["Office & Web", "Gaming"],
// 		minBudgetTier: "budget",
// 		socket: "LGA1700",
// 		cores: 4,
// 		threads: 8,
// 		tdpWatt: 58,
// 		shopListings: [
// 			{
// 				shop: shopIds["Star Tech Ltd. - IDB Branch"],
// 				price: 10500,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "AMD Ryzen 3 4100",
// 		brand: "AMD",
// 		category: "CPU",
// 		specs: {
// 			Cores: 4,
// 			Threads: 8,
// 			"Base Clock": "3.8 GHz",
// 			"Boost Clock": "4.0 GHz",
// 			TDP: "65W",
// 			Socket: "AM4",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		cores: 4,
// 		threads: 8,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{
// 				shop: shopIds["Techland BD - Uttara Branch"],
// 				price: 9800,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "Intel Core i3-10100F",
// 		brand: "Intel",
// 		category: "CPU",
// 		specs: {
// 			Cores: 4,
// 			Threads: 8,
// 			"Base Clock": "3.6 GHz",
// 			"Boost Clock": "4.3 GHz",
// 			TDP: "65W",
// 			Socket: "LGA1200",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "LGA1200",
// 		cores: 4,
// 		threads: 8,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{
// 				shop: shopIds["PC House BD - Elephant Road"],
// 				price: 8500,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "AMD Ryzen 3 3200G",
// 		brand: "AMD",
// 		category: "CPU",
// 		specs: {
// 			Cores: 4,
// 			Threads: 8,
// 			"Base Clock": "3.6 GHz",
// 			"Boost Clock": "4.0 GHz",
// 			TDP: "65W",
// 			Socket: "AM4",
// 			"Integrated Graphics": "Yes",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		cores: 4,
// 		threads: 8,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{ shop: shopIds["Skyland Computer BD"], price: 7800, stock: "in_stock" },
// 		],
// 	},
// 	{
// 		name: "Intel Pentium Gold G6400",
// 		brand: "Intel",
// 		category: "CPU",
// 		specs: {
// 			Cores: 2,
// 			Threads: 4,
// 			"Base Clock": "4.0 GHz",
// 			TDP: "58W",
// 			Socket: "LGA1200",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "LGA1200",
// 		cores: 2,
// 		threads: 4,
// 		tdpWatt: 58,
// 		shopListings: [
// 			{
// 				shop: shopIds["Creatus Computer - Multiplan"],
// 				price: 6500,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "AMD Ryzen 5 2600",
// 		brand: "AMD",
// 		category: "CPU",
// 		specs: {
// 			Cores: 6,
// 			Threads: 12,
// 			"Base Clock": "3.4 GHz",
// 			"Boost Clock": "3.9 GHz",
// 			TDP: "65W",
// 			Socket: "AM4",
// 		},
// 		usageTags: ["Gaming", "Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		cores: 6,
// 		threads: 12,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{
// 				shop: shopIds["Ryans Computers - Multiplan Centre"],
// 				price: 11500,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "Intel Core i5-10400F",
// 		brand: "Intel",
// 		category: "CPU",
// 		specs: {
// 			Cores: 6,
// 			Threads: 12,
// 			"Base Clock": "2.9 GHz",
// 			"Boost Clock": "4.3 GHz",
// 			TDP: "65W",
// 			Socket: "LGA1200",
// 		},
// 		usageTags: ["Gaming"],
// 		minBudgetTier: "budget",
// 		socket: "LGA1200",
// 		cores: 6,
// 		threads: 12,
// 		tdpWatt: 65,
// 		shopListings: [
// 			{
// 				shop: shopIds["Star Tech Ltd. - Multiplan Branch"],
// 				price: 12800,
// 				stock: "in_stock",
// 			},
// 		],
// 	},

// 	// ==================== BUDGET MOTHERBOARDS (কম দামের) ====================
// 	{
// 		name: "GIGABYTE H410M S2H",
// 		brand: "GIGABYTE",
// 		category: "Motherboard",
// 		specs: {
// 			Socket: "LGA1200",
// 			Chipset: "H410",
// 			"Form Factor": "mATX",
// 			RAM: "DDR4",
// 			"Max RAM": "64GB",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "LGA1200",
// 		supportedRamGeneration: "DDR4",
// 		supportedStorageInterfaces: ["SATA"],
// 		shopListings: [
// 			{
// 				shop: shopIds["Techland BD - Multiplan Branch"],
// 				price: 7200,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "MSI PRO H610M-G DDR4",
// 		brand: "MSI",
// 		category: "Motherboard",
// 		specs: {
// 			Socket: "LGA1700",
// 			Chipset: "H610",
// 			"Form Factor": "mATX",
// 			RAM: "DDR4",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "LGA1700",
// 		supportedRamGeneration: "DDR4",
// 		supportedStorageInterfaces: ["SATA"],
// 		shopListings: [
// 			{
// 				shop: shopIds["Star Tech Ltd. - IDB Branch"],
// 				price: 9200,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "ASUS PRIME B450M-A II",
// 		brand: "ASUS",
// 		category: "Motherboard",
// 		specs: {
// 			Socket: "AM4",
// 			Chipset: "B450",
// 			"Form Factor": "mATX",
// 			RAM: "DDR4",
// 		},
// 		usageTags: ["Office & Web", "Gaming"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		supportedRamGeneration: "DDR4",
// 		supportedStorageInterfaces: ["NVMe_Gen3", "SATA"],
// 		shopListings: [
// 			{
// 				shop: shopIds["PC House BD - Elephant Road"],
// 				price: 8500,
// 				stock: "in_stock",
// 			},
// 		],
// 	},
// 	{
// 		name: "GIGABYTE B450M DS3H V2",
// 		brand: "GIGABYTE",
// 		category: "Motherboard",
// 		specs: {
// 			Socket: "AM4",
// 			Chipset: "B450",
// 			"Form Factor": "mATX",
// 			RAM: "DDR4",
// 		},
// 		usageTags: ["Office & Web"],
// 		minBudgetTier: "budget",
// 		socket: "AM4",
// 		supportedRamGeneration: "DDR4",
// 		supportedStorageInterfaces: ["SATA"],
// 		shopListings: [
// 			{ shop: shopIds["Skyland Computer BD"], price: 7800, stock: "in_stock" },
// 		],
// 	},
// ];

// async function seedEntryLevel() {
// 	try {
// 		await mongoose.connect(
// 			"mongodb+srv://meherajhosen786_db_user:hossen5799raj@primary.ydl4rgk.mongodb.net/dhaka-aggregator",
// 		);
// 		console.log("✅ MongoDB Connected");

// 		let insertedCount = 0;

// 		for (const item of entryLevelItems) {
// 			const existing = await PCComponent.findOne({ name: item.name });

// 			if (existing) {
// 				console.log(`⚠️ Already exists: ${item.name}`);
// 				continue;
// 			}

// 			await PCComponent.create(item);
// 			insertedCount++;
// 			console.log(`✅ Added: ${item.name}`);
// 		}

// 		console.log(
// 			`🎉 Successfully seeded ${insertedCount} Entry Level components!`,
// 		);
// 	} catch (error: any) {
// 		console.error("❌ Seeding failed:", error.message);
// 	} finally {
// 		await mongoose.disconnect();
// 	}
// }

// seedEntryLevel();
