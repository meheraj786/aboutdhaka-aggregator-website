import { z } from "zod";

const qualificationSchema = z.object({
	degree: z.string().min(1, "Degree is required"),
	institution: z.string().min(1, "Institution is required"),
	passingYear: z
		.number()
		.int()
		.min(1900, "Passing year is invalid")
		.max(new Date().getFullYear(), "Passing year is invalid"),
});

const contactSchema = z.object({
	phone: z.string().min(1, "Phone number is required"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const createDoctorSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	slug: z.string().optional(),
	departments: z
		.array(z.string())
		.min(1, "At least one department is required"),
	qualifications: z
		.array(qualificationSchema)
		.min(1, "At least one qualification is required"),
	designation: z.string().min(1, "Designation is required"),
	experience: z.number().min(0, "Experience cannot be negative").optional(),
	bio: z.string().min(1, "Bio is required"),
	contact: contactSchema,
	profileImage: z.string().url("Invalid image URL").optional(),
	gender: z.enum(["male", "female", "other"]).optional(),
	bmdc: z.string().min(1, "BMDC registration is required"),
	speciality: z.array(z.string()).optional().default([]),
	chamber: z.array(z.string()).min(1, "At least one chamber is required"),
	isVerified: z.boolean().default(false),
	isActive: z.boolean().default(true),
	rating: z.number().min(0).max(5),
	reviewCount: z.number().int().min(0).default(0),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
