import { z } from "zod";

export const createBusSchema = z.object({
	busName: z
		.string()
		.min(1, "Bus name is required")
		.min(3, "Bus name must be at least 3 characters"),
	stops: z.array(z.string()).min(1, "At least one stop is required"),
});

export type CreateBusInput = z.infer<typeof createBusSchema>;
