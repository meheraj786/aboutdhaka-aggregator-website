import { z } from "zod";

export const createBusStopSchema = z.object({
	stopName: z.string().min(1, "Stop name is required"),
	area: z.string().min(1, "Area is required"),
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
});

export type CreateBusStopInput = z.infer<typeof createBusStopSchema>;
