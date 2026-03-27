import { z } from "zod";

export const createRestaurantSchema = z.object({
	name: z.string().min(1, "Name is required"),
	area: z.string().min(1, "Area is required"),
	location: z.string().min(1, "Location is required"),
	category: z.string().optional().default(""),
	detail: z.string().optional().default(""),
	rating: z.coerce.number().min(0).max(5).default(0),
	phone: z.string().optional().default(""),
	amenities: z.array(z.string()).default([]),
	gallery: z.array(z.string().url("Invalid URL")).default([]),
	hours: z.record(z.string()).optional(),
	menu: z.any().optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
