import { z } from "zod";

export const createAreaSchema = z.object({
	name: z
		.string()
		.min(1, "Area name is required")
		.min(3, "Area name must be at least 3 characters"),
});

export type CreateAreaInput = z.infer<typeof createAreaSchema>;
