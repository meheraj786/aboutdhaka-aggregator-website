"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import {
	type ComponentCategory,
	type IPCComponent,
	PCComponent,
} from "@/models/pcComponent.model";
import type { PCComponentInput } from "@/validators/pcComponent";

// ─── types ────────────────────────────────────────────────────────────────────

export interface IShopListingPopulated {
	_id: string;
	shop: {
		_id: string;
		name: string;
		location: string;
		lat?: number; // ✅ added
		long?: number; // ✅ added
		website?: string;
		phone?: string;
		rating?: number;
	};
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
	usageTags: string[];
	minBudgetTier: "budget" | "mid" | "high-end";
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

// ─── serializer ───────────────────────────────────────────────────────────────
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

// ─── helpers ──────────────────────────────────────────────────────────────────
function getBudgetTiers(
	tier: "budget" | "mid" | "high-end",
): ("budget" | "mid" | "high-end")[] {
	if (tier === "budget") return ["budget"];
	if (tier === "mid") return ["budget", "mid"];
	return ["budget", "mid", "high-end"];
}

function getMinCores(usage: string): number {
	return (
		{ Gaming: 6, "Content Creation": 12, Development: 4, "Office & Web": 2 }[
			usage
		] ?? 4
	);
}

function getMinRAM(tabs: number): number {
	if (tabs <= 10) return 8;
	if (tabs <= 30) return 16;
	if (tabs <= 50) return 32;
	return 64;
}

// ─── fetch with 3-level fallback ─────────────────────────────────────────────
async function fetchCategory(
	category: ComponentCategory,
	usage: string,
	budgetTiers: ("budget" | "mid" | "high-end")[],
	limit = 3,
): Promise<IPCComponentPopulated[]> {
	// attempt 1: usageTags + budgetTier match
	let docs = await PCComponent.find({
		category,
		usageTags: usage,
		minBudgetTier: { $in: budgetTiers },
	})
		.sort({ "shopListings.0.price": 1 })
		.limit(limit)
		.populate({
			path: "shopListings.shop",
			select: "name location lat long website phone rating", // ✅ explicitly select lat/long
		})
		.lean();

	// attempt 2: usageTags only
	if (docs.length === 0) {
		docs = await PCComponent.find({ category, usageTags: usage })
			.sort({ "shopListings.0.price": 1 })
			.limit(limit)
			.populate({
				path: "shopListings.shop",
				select: "name location lat long website phone rating",
			})
			.lean();
	}

	// attempt 3: category only
	if (docs.length === 0) {
		docs = await PCComponent.find({ category })
			.sort({ "shopListings.0.price": 1 })
			.limit(limit)
			.populate({
				path: "shopListings.shop",
				select: "name location lat long website phone rating",
			})
			.lean();
	}

	return serializeData(docs as unknown as IPCComponentPopulated[]);
}

// ─── queries ──────────────────────────────────────────────────────────────────
export async function getComponents(params?: GetComponentsParams) {
	await dbConnect();

	if (!params) {
		const components = await PCComponent.find({})
			.sort({ category: 1, name: 1 })
			.populate({
				path: "shopListings.shop",
				select: "name location lat long website phone rating",
			})
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
			.populate({
				path: "shopListings.shop",
				select: "name location lat long website phone rating",
			})
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

// ─── rule-based suggestion engine ────────────────────────────────────────────
export async function getSuggestedBuild(
	query: SuggestionQuery,
): Promise<SuggestedBuild[]> {
	await dbConnect();

	const tiers = getBudgetTiers(query.budgetTier);
	const minCores = getMinCores(query.mainUsage);
	const minRAM = getMinRAM(query.browserTabs);

	const results: SuggestedBuild[] = [];

	const cpus = await fetchCategory("CPU", query.mainUsage, tiers);
	if (cpus.length > 0)
		results.push({ category: "CPU", components: cpus, minSpecs: { minCores } });

	const skipGPU =
		query.mainUsage === "Office & Web" && query.budgetTier === "budget";
	if (!skipGPU) {
		const gpus = await fetchCategory("GPU", query.mainUsage, tiers);
		if (gpus.length > 0) results.push({ category: "GPU", components: gpus });
	}

	const rams = await fetchCategory("RAM", query.mainUsage, tiers);
	if (rams.length > 0)
		results.push({ category: "RAM", components: rams, minSpecs: { minRAM } });

	const mbs = await fetchCategory("Motherboard", query.mainUsage, tiers);
	if (mbs.length > 0)
		results.push({ category: "Motherboard", components: mbs });

	const storages = await fetchCategory("Storage", query.mainUsage, tiers);
	if (storages.length > 0)
		results.push({ category: "Storage", components: storages });

	const psus = await fetchCategory("PSU", query.mainUsage, tiers);
	if (psus.length > 0) results.push({ category: "PSU", components: psus });

	return results;
}

// ─── mutations ────────────────────────────────────────────────────────────────
export async function createComponent(data: PCComponentInput) {
	await dbConnect();
	const component = await PCComponent.create(data as unknown as IPCComponent);
	revalidatePath("/dashboard/components");
	return serializeData(
		component.toObject() as unknown as IPCComponentPopulated,
	);
}

export async function updateComponent(id: string, data: PCComponentInput) {
	await dbConnect();
	const component = await PCComponent.findByIdAndUpdate(
		id,
		data as unknown as IPCComponent,
		{ new: true, runValidators: true },
	);
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

export async function upsertShopListing(
	componentId: string,
	listing: { shop: string; price: number; stock: string; url?: string },
) {
	await dbConnect();
	const component = await PCComponent.findById(componentId);
	if (!component) throw new Error("Component not found");

	const mongoose = require("mongoose");
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
			shop: new mongoose.Types.ObjectId(listing.shop),
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
