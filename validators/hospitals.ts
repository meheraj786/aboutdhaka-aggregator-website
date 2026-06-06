import { z } from "zod";
import { HOSPITAL_TYPES } from "@/lib/hospitalTypes";

const serviceSchema = z.object({
	name: z.string().min(1, "Service name is required"),
	description: z.string().optional(),
	icon: z.string().optional(),
	averageCost: z.coerce.number().min(0).optional(),
});

const testPriceSchema = z.object({
	name: z.string().min(1, "Test name is required"),
	price: z.string().min(1, "Price is required"),
});

const addressSchema = z.object({
	area: z.string().min(1, "Area is required").optional(),
	district: z.string().default("Dhaka"),
	division: z.string().default("Dhaka"),
	coordinates: z
		.object({
			lat: z.number().min(-90).max(90).optional(),
			lng: z.number().min(-180).max(180).optional(),
		})
		.optional(),
});

const contactSchema = z.object({
	phone: z.array(z.string().trim()).optional().default([]),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const reviewSchema = z.object({
	reviewer: z.string().optional(),
	comment: z.string().optional(),
	time: z.string().optional(),
	initial: z.string().optional(),
	rating: z.number().min(0).max(5).optional(),
});

export const createHospitalSchema = z.object({
	name: z.string().min(2, "Hospital name is required"),
	slug: z.string().optional(),

	types: z.array(z.enum(HOSPITAL_TYPES)).optional().default([]),

	address: addressSchema.optional().default({
		area: "",
		district: "Dhaka",
		division: "Dhaka",
	}),

	contact: contactSchema.optional().default({
		phone: [],
		email: "",
		website: "",
	}),

	services: z.array(serviceSchema).optional().default([]),
	testPrices: z.array(testPriceSchema).optional().default([]),

	about: z.string().optional().default(""),

	images: z.array(z.string().url()).optional().default([]),
	thumbnail: z
		.string()
		.url("Invalid thumbnail URL")
		.optional()
		.or(z.literal("")),

	facilities: z.array(z.string().trim()).optional().default([]),

	totalBeds: z.number().int().nonnegative().optional(),
	established: z
		.number()
		.int()
		.min(1800)
		.max(new Date().getFullYear())
		.optional(),

	googleMapReviewLink: z.string().url().optional().or(z.literal("")),

	reviews: z.array(reviewSchema).optional().default([]),

	isVerified: z.boolean().default(false),
	isActive: z.boolean().default(true),
	rating: z.number().min(0).max(5).default(0),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
