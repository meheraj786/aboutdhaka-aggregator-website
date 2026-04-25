import { z } from "zod";

export const createMedicalCategorySchema = z.object({
	name: z.string().min(1, "Category name is required"),
	slug: z.string().optional(),
	type: z.enum(["hospital", "doctor"], {
		message: "Type must be either 'hospital' or 'doctor'",
	}),
	description: z.string().optional(),
	icon: z.string().optional(),
	isActive: z.boolean(),
});

export const updateMedicalCategorySchema =
	createMedicalCategorySchema.partial();

export type CreateMedicalCategoryInput = z.infer<
	typeof createMedicalCategorySchema
>;
export type UpdateMedicalCategoryInput = z.infer<
	typeof updateMedicalCategorySchema
>;
