import { z } from "zod";

export const createDoctorSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	area: z.string(),
	location: z.string(),
	category: z.string(),
	phone: z.string().optional(),
	fee: z.number().min(0).optional(),
	availableDays: z.array(z.string()).optional(),
	qualification: z.string().optional(),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
