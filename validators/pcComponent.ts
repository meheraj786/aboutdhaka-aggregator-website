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
    .default([]),
  minBudgetTier: z.enum(["budget", "mid", "high-end"]).default("mid"),
  specs: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .default({}),
  shopListings: z.array(shopListingInputSchema).default([]),

  // Compatibility fields
  socket: z
    .enum(["AM4", "AM5", "LGA1700", "LGA1200", "LGA1151", "other"])
    .optional(),
  cores: z.number().int().positive().optional(),
  threads: z.number().int().positive().optional(),
  ramGeneration: z.enum(["DDR4", "DDR5"]).optional(),
  ramCapacityGb: z.number().positive().optional(),
  vramGb: z.number().positive().optional(),
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