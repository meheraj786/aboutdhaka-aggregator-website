"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import {
	type ComponentCategory,
	// type IPCComponent,
	PCComponent,
} from "@/models/pcComponent.model";
import type { PCComponentInput } from "@/validators/pcComponent";

export interface IShopListingPopulated {
	_id: string;
	shop: { _id: string; name: string; location: string; website?: string };
	price: number;
	stock: "in_stock" | "out_of_stock" | "limited";
	url?: string;
	lastUpdated: string;
}

export interface IPCComponentPopulated {
	_id: string;
	name: string;
	brand: string;
	category: ComponentCategory;
	imageUrl?: string;
	specs: Record<string, string | number | boolean | null | undefined>;
	shopListings: IShopListingPopulated[];
	cores?: number;
	threads?: number;
	createdAt: string;
	updatedAt: string;
}

export type GetComponentsParams = {
	page: number;
	pageSize: number;
	search?: string;
	category?: ComponentCategory;
};

// ---- Serializer (same pattern as your area.action) ----
function serializeData<T>(data: T): T {
	if (data === null || data === undefined) return data;
	if (typeof data === "object" && data.constructor?.name === "ObjectId")
		return (data as { toString(): string }).toString() as unknown as T;
	if (data instanceof Date) return data.toISOString() as unknown as T;
	if (Array.isArray(data)) return data.map(serializeData) as unknown as T;
	if (typeof data === "object") {
		const result: Record<string, unknown> = {};
		for (const key in data) {
			if (Object.hasOwn(data, key))
				result[key] = serializeData((data as Record<string, unknown>)[key]);
		}
		return result as T;
	}
	return data;
}

// ---- Queries ----
export async function getComponents(params?: GetComponentsParams) {
	await dbConnect();

	if (!params) {
		const components = await PCComponent.find({})
			.sort({ category: 1, name: 1 })
			.populate("shopListings.shop")
			.lean();
		return serializeData(components as unknown as IPCComponentPopulated[]);
	}

	const skip = (params.page - 1) * params.pageSize;
	const query: Record<string, unknown> = {};
	if (params.search) query.name = { $regex: params.search, $options: "i" };
	if (params.category) query.category = params.category;

	const [items, totalCount] = await Promise.all([
		PCComponent.find(query)
			.sort({ category: 1, name: 1 })
			.skip(skip)
			.limit(params.pageSize)
			.populate("shopListings.shop")
			.lean(),
		PCComponent.countDocuments(query),
	]);

	return {
		items: serializeData(items as unknown as IPCComponentPopulated[]),
		totalCount,
		currentPage: params.page,
		totalPages: Math.ceil(totalCount / params.pageSize),
	};
}

// ---- Rule-based suggestion engine ----
export interface SuggestionQuery {
	mainUsage: "Gaming" | "Content Creation" | "Development" | "Office & Web";
	browserTabs: number;
	software: string[];
	storageNeeds: "Light" | "Medium" | "Heavy";
	budgetTier: "budget" | "mid" | "high-end";
}

export interface SuggestedBuild {
	category: ComponentCategory;
	components: IPCComponentPopulated[];
	minSpecs?: {
		minCores?: number;
		minRAM?: number;
	};
}

// Helper: Get minimum cores needed for usage
function getMinCoresForUsage(usage: string): number {
	const coreRequirements: Record<string, number> = {
		Gaming: 6,
		"Content Creation": 12,
		Development: 4,
		"Office & Web": 2,
	};
	return coreRequirements[usage] || 4;
}

// Helper: Get minimum cores needed for software
// function getMinCoresForSoftware(software: string[]): number {
// 	const softwareCoreRequirements: Record<string, number> = {
// 		"Adobe Premiere": 12,
// 		Blender: 12,
// 		"DaVinci Resolve": 12,
// 		AutoCAD: 8,
// 		"Visual Studio Code": 4,
// 		"Microsoft Excel": 4,
// 		Discord: 2,
// 		"Chrome / Edge": 2,
// 	};

// 	if (software.length === 0) return 0;

// 	// Return the highest core requirement among selected software
// 	return Math.max(...software.map((sw) => softwareCoreRequirements[sw] || 2));
// }

// Helper: Get minimum RAM for multitasking
function getMinRAMForTabs(tabs: number): number {
	if (tabs <= 10) return 8;
	if (tabs <= 30) return 16;
	if (tabs <= 50) return 32;
	return 64;
}

// Helper: Categorize components by shop price (into budget tiers)
async function categorizeBudgetTier(
	components: IPCComponentPopulated[],
): Promise<IPCComponentPopulated[][]> {
	// Group by price: budget (0-25th), mid (25-75th), high-end (75-100th)
	if (components.length === 0) return [[], [], []];

	const prices = components
		.flatMap((c) => c.shopListings.map((l) => l.price))
		.sort((a, b) => a - b);

	const p25 = prices[Math.floor(prices.length * 0.25)];
	const p75 = prices[Math.floor(prices.length * 0.75)];

	const budget = components.filter((c) => {
		const minPrice = Math.min(...c.shopListings.map((l) => l.price));
		return minPrice <= p25;
	});

	const mid = components.filter((c) => {
		const minPrice = Math.min(...c.shopListings.map((l) => l.price));
		return minPrice > p25 && minPrice <= p75;
	});

	const highEnd = components.filter((c) => {
		const minPrice = Math.min(...c.shopListings.map((l) => l.price));
		return minPrice > p75;
	});

	return [budget, mid, highEnd];
}

export async function getSuggestedBuild(
	query: SuggestionQuery,
): Promise<SuggestedBuild[]> {
	await dbConnect();

	const minCores = getMinCoresForUsage(query.mainUsage);
	const minRAM = getMinRAMForTabs(query.browserTabs);

	// CPU suggestion based on cores
	const cpus = await PCComponent.find({
		category: "CPU",
		cores: { $gte: minCores },
	})
		.populate("shopListings.shop")
		.lean();

	const serializedCPUs = serializeData(
		cpus as unknown as IPCComponentPopulated[],
	);
	const [budgetCPUs, midCPUs, highCPUs] =
		await categorizeBudgetTier(serializedCPUs);

	// Select CPUs based on user's budget tier
	const selectedCPUs =
		query.budgetTier === "budget"
			? budgetCPUs
			: query.budgetTier === "mid"
				? [...midCPUs, ...budgetCPUs]
				: [...highCPUs, ...midCPUs, ...budgetCPUs];

	const topCPUs = selectedCPUs.slice(0, 3);

	// Determine component requirements based on CPU tier and workload
	const hasHighEndCPU = topCPUs.some((c) =>
		c.shopListings.some((l) => l.price > 50000),
	);

	const results: SuggestedBuild[] = [];

	// CPU
	if (topCPUs.length > 0) {
		results.push({
			category: "CPU",
			components: topCPUs,
			minSpecs: { minCores },
		});
	}

	// GPU - based on workload
	let gpuQuery: Record<string, unknown> = { category: "GPU" };
	if (query.mainUsage === "Office & Web" && query.budgetTier === "budget") {
		gpuQuery = {}; // Skip GPU
	} else {
		const gpus = await PCComponent.find(gpuQuery)
			.populate("shopListings.shop")
			.limit(50)
			.lean();

		const serializedGPUs = serializeData(
			gpus as unknown as IPCComponentPopulated[],
		);
		const [budgetGPUs, midGPUs, highGPUs] =
			await categorizeBudgetTier(serializedGPUs);

		const selectedGPUs =
			query.mainUsage === "Gaming"
				? [...highGPUs, ...midGPUs, ...budgetGPUs] // Gaming needs high-end GPU
				: query.mainUsage === "Content Creation"
					? [...midGPUs, ...budgetGPUs]
					: [...budgetGPUs]; // Development & Office use budget GPU

		if (selectedGPUs.length > 0) {
			results.push({
				category: "GPU",
				components: selectedGPUs.slice(0, 3),
			});
		}
	}

	// RAM - based on multitasking
	const rams = await PCComponent.find({ category: "RAM" })
		.populate("shopListings.shop")
		.limit(50)
		.lean();

	const serializedRAMs = serializeData(
		rams as unknown as IPCComponentPopulated[],
	);
	const [budgetRAMs, midRAMs, highRAMs] =
		await categorizeBudgetTier(serializedRAMs);

	const selectedRAMs =
		query.browserTabs > 50
			? [...highRAMs, ...midRAMs]
			: query.browserTabs > 30
				? [...midRAMs, ...budgetRAMs]
				: budgetRAMs;

	if (selectedRAMs.length > 0) {
		results.push({
			category: "RAM",
			components: selectedRAMs.slice(0, 3),
			minSpecs: { minRAM },
		});
	}

	// Motherboard - match CPU tier
	const motherboards = await PCComponent.find({ category: "Motherboard" })
		.populate("shopListings.shop")
		.limit(50)
		.lean();

	const serializedMotherboards = serializeData(
		motherboards as unknown as IPCComponentPopulated[],
	);
	const [budgetMB, midMB, highMB] = await categorizeBudgetTier(
		serializedMotherboards,
	);

	const selectedMB = hasHighEndCPU
		? [...highMB, ...midMB]
		: [...midMB, ...budgetMB];

	if (selectedMB.length > 0) {
		results.push({
			category: "Motherboard",
			components: selectedMB.slice(0, 3),
		});
	}

	// Storage - based on storage needs
	const storages = await PCComponent.find({ category: "Storage" })
		.populate("shopListings.shop")
		.limit(50)
		.lean();

	const serializedStorages = serializeData(
		storages as unknown as IPCComponentPopulated[],
	);

	if (serializedStorages.length > 0) {
		results.push({
			category: "Storage",
			components: serializedStorages.slice(0, 3),
		});
	}

	// PSU - based on GPU demand
	const psus = await PCComponent.find({ category: "PSU" })
		.populate("shopListings.shop")
		.limit(50)
		.lean();

	const serializedPSUs = serializeData(
		psus as unknown as IPCComponentPopulated[],
	);

	if (serializedPSUs.length > 0) {
		results.push({
			category: "PSU",
			components: serializedPSUs.slice(0, 3),
		});
	}

	return results;
}

// ---- Mutations ----
export async function createComponent(data: PCComponentInput) {
	await dbConnect();
	const component = await PCComponent.create(data);
	revalidatePath("/dashboard/components");

	return serializeData(
		component.toObject() as unknown as IPCComponentPopulated,
	);
}

export async function updateComponent(id: string, data: PCComponentInput) {
	await dbConnect();
	const component = await PCComponent.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!component) throw new Error("Component not found");

	revalidatePath("/dashboard/components");
	return serializeData(
		component.toObject() as unknown as IPCComponentPopulated,
	);
}

export async function deleteComponent(id: string) {
	await dbConnect();
	await PCComponent.findByIdAndDelete(id);
	revalidatePath("/dashboard/components");
	return { success: true };
}

// Add/update a shop listing on a component
export async function upsertShopListing(
	componentId: string,
	listing: { shop: string; price: number; stock: string; url?: string },
) {
	await dbConnect();
	const component = await PCComponent.findById(componentId);
	if (!component) throw new Error("Component not found");

	const existing = component.shopListings.find(
		(l) => l.shop.toString() === listing.shop,
	);
	if (existing) {
		existing.price = listing.price;
		existing.stock = listing.stock as "in_stock" | "out_of_stock" | "limited";
		existing.url = listing.url;
		existing.lastUpdated = new Date();
	} else {
		component.shopListings.push({
			shop: new (require("mongoose").Types.ObjectId)(listing.shop),
			price: listing.price,
			stock: listing.stock as "in_stock" | "out_of_stock" | "limited",
			url: listing.url,
			lastUpdated: new Date(),
		});
	}

	await component.save();
	revalidatePath("/dashboard/components");
	return serializeData(
		component.toObject() as unknown as IPCComponentPopulated,
	);
}

export async function removeShopListing(componentId: string, shopId: string) {
	await dbConnect();
	await PCComponent.findByIdAndUpdate(componentId, {
		$pull: { shopListings: { shop: shopId } },
	});
	revalidatePath("/dashboard/components");
	return { success: true };
}
