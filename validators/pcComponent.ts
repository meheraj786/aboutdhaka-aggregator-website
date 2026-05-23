import { z } from "zod";

export interface ShopListingInput {
	shop: string;
	price: number;
	stock: "in_stock" | "out_of_stock" | "limited";
	url?: string;
}

export interface PCComponentInput {
	name: string;
	brand: string;
	category:
		| "CPU"
		| "GPU"
		| "RAM"
		| "Motherboard"
		| "Storage"
		| "PSU"
		| "Case"
		| "Cooler";
	imageUrl?: string;
	specs: Record<string, string | number | boolean>;
	shopListings: ShopListingInput[];
	cores?: number;
	threads?: number;
}

export interface ShopInput {
	name: string;
	location: string;
	lat?: number;
	long?: number;
	rating: number;
	website?: string;
	phone?: string;
}

export const shopListingInputSchema: z.ZodType<ShopListingInput> = z.object({
	shop: z.string().min(1, "Shop required"),
	price: z.number().positive("Price must be positive"),
	stock: z.enum(["in_stock", "out_of_stock", "limited"]),
	url: z.string().url().optional().or(z.literal("")),
});

export const pcComponentInputSchema: z.ZodType<PCComponentInput> = z.object({
	name: z.string().min(1, "Name required"),
	brand: z.string().min(1, "Brand required"),
	category: z.enum([
		"CPU",
		"GPU",
		"RAM",
		"Motherboard",
		"Storage",
		"PSU",
		"Case",
		"Cooler",
	]),
	imageUrl: z.string().url().optional().or(z.literal("")),
	specs: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
	shopListings: z.array(shopListingInputSchema),
	cores: z.number().int().positive("Cores must be positive").optional(),
	threads: z.number().int().positive("Threads must be positive").optional(),
});

export const shopInputSchema: z.ZodType<ShopInput> = z.object({
	name: z.string().min(1, "Name required"),
	location: z.string().min(1, "Location required"),
	lat: z.number().optional(),
	long: z.number().optional(),
	rating: z.number().min(0).max(5),
	website: z.string().url().optional().or(z.literal("")),
	phone: z.string().optional(),
});
