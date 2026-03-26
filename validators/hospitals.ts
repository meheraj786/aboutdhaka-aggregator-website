import { z } from "zod";

export const createHospitalSchema = z.object({
	name: z.string().min(2),
	area: z.string(),
	location: z.string(),
	category: z.string(),
	phone: z.string().optional(),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
