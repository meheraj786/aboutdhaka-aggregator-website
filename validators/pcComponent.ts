import { z } from "zod";

export const shopListingInputSchema = z.object({
	shop: z.string().min(1, "Shop required"),
	price: z.number().positive("Price must be positive"),
	stock: z.enum(["in_stock", "out_of_stock", "limited"]),
	url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ShopListingInput = z.infer<typeof shopListingInputSchema>;

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
	imageUrl: z.string().url().or(z.literal("")).optional(),
	usageTags: z
		.array(
			z.enum(["Gaming", "Content Creation", "Development", "Office & Web"]),
		)
		.optional(),
	minBudgetTier: z.enum(["budget", "mid", "high-end"]).optional(),
	specs: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional(),
	shopListings: z.array(shopListingInputSchema).optional(),

	// CPU & Motherboard
	socket: z
		.enum(["AM4", "AM5", "LGA1700", "LGA1200", "LGA1151", "other"])
		.optional(),

	// CPU specific
	cores: z.number().int().positive().optional(),
	threads: z.number().int().positive().optional(),
	tdpWatt: z.number().positive().optional(),

	// Motherboard specific
	supportedRamGeneration: z.enum(["DDR3", "DDR4", "DDR5"]).optional(),
	supportedStorageInterfaces: z
		.array(z.enum(["NVMe_Gen3", "NVMe_Gen4", "SATA"]))
		.optional(),

	// RAM specific
	ramGeneration: z.enum(["DDR3", "DDR4", "DDR5"]).optional(),
	ramCapacityGb: z.number().positive().optional(),

	// GPU specific
	vramGb: z.number().positive().optional(),
	gpuTdpWatt: z.number().positive().optional(),

	// Storage specific
	storageInterface: z.enum(["NVMe_Gen3", "NVMe_Gen4", "SATA"]).optional(),
	storageCapacityGb: z.number().positive().optional(),

	// PSU specific
	wattage: z.number().positive().optional(),
});

export type PCComponentInput = z.infer<typeof pcComponentInputSchema>;

export const shopInputSchema = z.object({
	name: z.string().min(1, "Shop name required"),
	location: z.string().min(1, "Location required"),
	lat: z.number().optional(),
	long: z.number().optional(),
	rating: z.number().min(0).max(5).optional(),
	website: z.string().url().optional().or(z.literal("")),
	phone: z.string().optional(),
});

export type ShopInput = z.infer<typeof shopInputSchema>;
