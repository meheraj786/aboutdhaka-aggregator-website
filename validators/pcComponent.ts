import { z } from "zod";

export const shopListingInputSchema = z.object({
	shop: z.string().min(1, "Shop required"),
	price: z.number().positive("Price must be positive"),
	stock: z.enum(["in_stock", "out_of_stock", "limited"]).default("in_stock"),
	url: z.string().url().optional().or(z.literal("")),
});

export const pcComponentInputSchema = z.object({
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
	specs: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.default({}),
	shopListings: z.array(shopListingInputSchema).default([]),
	cores: z.number().int().positive("Cores must be positive").optional(),
	threads: z.number().int().positive("Threads must be positive").optional(),
});

export type PCComponentInput = z.infer<typeof pcComponentInputSchema>;

export const shopInputSchema = z.object({
	name: z.string().min(1, "Name required"),
	location: z.string().min(1, "Location required"),
	lat: z.coerce.number().optional(),
	long: z.coerce.number().optional(),
	rating: z.coerce.number().min(0).max(5).default(0),
	website: z.string().url().optional().or(z.literal("")),
	phone: z.string().optional(),
});

export type ShopInput = z.infer<typeof shopInputSchema>;
