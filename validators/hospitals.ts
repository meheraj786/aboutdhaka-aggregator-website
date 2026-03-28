import { z } from "zod";

export const createHospitalSchema = z.object({
	name: z.string().min(2, "Name is required"),
	area: z.string().min(1, "Area is required"),
	location: z.string().default(""),
	category: z.string().default("General"),
	detail: z.string().default(""),
	phone: z.string().default(""),
	rating: z.coerce.number().default(0),
	testPrices: z
		.array(
			z.object({
				name: z.string().min(1, "Test name is required"),
				price: z.string().min(1, "Price is required"),
			}),
		)
		.default([]),
	services: z.array(z.string()).default([]),
	image: z.string().default(""),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
