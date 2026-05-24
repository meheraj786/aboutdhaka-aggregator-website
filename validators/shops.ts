import { z } from "zod";

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
