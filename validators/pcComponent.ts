import { z } from "zod";
import type {
	IPCComponent,
	IShopListing,
	UsageTag,
} from "@/models/pcComponent.model";
import type { IShop } from "@/models/shop.model";

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
	imageUrl: z.string().url().or(z.literal("")).optional(),

	usageTags: z
		.array(
			z.enum(["Gaming", "Content Creation", "Development", "Office & Web"]),
		)
		.default([]),

	minBudgetTier: z.enum(["budget", "mid", "high-end"]).default("mid"),

	specs: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.default({}),

	shopListings: z.array(shopListingSchema).default([]),

	cores: z.number().int().positive("Cores must be positive").optional(),
	threads: z.number().int().positive("Threads must be positive").optional(),
});

export type PCComponentInput = z.infer<typeof pcComponentSchema>;
export const pcComponentInputSchema = pcComponentSchema;

export interface IPCComponentPopulated
	extends Omit<IPCComponent, "shopListings"> {
	usageTags: UsageTag[];
	minBudgetTier: "budget" | "mid" | "high-end";
	shopListings: (Omit<IShopListing, "shop"> & { shop: IShop | string })[];
}
