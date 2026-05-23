import { z } from "zod";

const shopListingSchema = z.object({
	shop: z.string().min(1, "Shop required"),
	price: z.number().positive("Price must be positive"),
	stock: z.enum(["in_stock", "out_of_stock", "limited"]),
	url: z.string().url().optional().or(z.literal("")),
});

export type ShopListingInput = z.infer<typeof shopListingSchema>;
export const shopListingInputSchema = shopListingSchema;

const pcComponentSchema = z.object({
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
	shopListings: z.array(shopListingSchema),
	cores: z.number().int().positive("Cores must be positive").optional(),
	threads: z.number().int().positive("Threads must be positive").optional(),
});

export type PCComponentInput = z.infer<typeof pcComponentSchema>;
export const pcComponentInputSchema = pcComponentSchema;

const shopSchema = z.object({
	name: z.string().min(1, "Name required"),
	location: z.string().min(1, "Location required"),
	lat: z.number().optional(),
	long: z.number().optional(),
	rating: z.number().min(0).max(5),
	website: z.string().url().optional().or(z.literal("")),
	phone: z.string().optional(),
});

export type ShopInput = z.infer<typeof shopSchema>;
export const shopInputSchema = shopSchema;
