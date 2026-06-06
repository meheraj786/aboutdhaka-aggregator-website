import { z } from "zod";

export const createPlaceSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	area: z.string().min(1, "Area is required"),
	location: z.string().min(1, "Location is required"),
	category: z.string().min(1, "Category is required"),
	detail: z.string().optional(),
	rating: z.number().min(0).max(5),
	hours: z
		.object({
			open: z.string().optional(),
			close: z.string().optional(),
		})
		.optional(),
	closingDay: z.string().optional(),
	fee: z.number().min(0),
	contact: z.string().optional(),
	facilities: z.array(z.string()),
	gallery: z.array(z.string()),
});

export const updatePlaceSchema = createPlaceSchema.partial();

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>;
