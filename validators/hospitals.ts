import { z } from "zod";

const serviceSchema = z.object({
	name: z.string().min(1, "Service name is required"),
	description: z.string().optional(),
	icon: z.string().optional(),
	averageCost: z.coerce
		.number()
		.min(0, "Average cost must be positive")
		.optional(),
});

const testPriceSchema = z.object({
	name: z.string().min(1, "Test name is required"),
	price: z.string().min(1, "Price is required"),
});

const addressSchema = z.object({
	area: z.string().min(1, "Area is required"),
	district: z.string().min(1, "District is required"),
	division: z.string().min(1, "Division is required"),
	coordinates: z.object({
		lat: z
			.number({ required_error: "Latitude is required" })
			.min(-90, "Latitude must be at least -90")
			.max(90, "Latitude must be at most 90"),
		lng: z
			.number({ required_error: "Longitude is required" })
			.min(-180, "Longitude must be at least -180")
			.max(180, "Longitude must be at most 180"),
	}),
});

const contactSchema = z.object({
	phone: z
		.array(z.string().min(1, "Phone number required"))
		.min(1, "At least one phone number is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	website: z.string().min(1, "Website is required").url("Invalid URL"),
});

const openHoursSchema = z.object({
	open: z.string().optional(),
	close: z.string().optional(),
	isOpen24Hours: z.boolean().default(false),
});

const reviewSchema = z.object({
	reviewer: z.string().min(1, "Reviewer name is required"),
	comment: z.string().min(1, "Review comment is required"),
	time: z.string().min(1, "Review time is required"),
	initial: z.string().min(1, "Initial is required"),
	rating: z
		.number({ required_error: "Review rating is required" })
		.min(0)
		.max(5),
});

export const createHospitalSchema = z.object({
	name: z.string().min(2, "Hospital name is required"),
	address: addressSchema,
	contact: contactSchema,
	services: z
		.array(serviceSchema)
		.min(1, "At least one service is required")
		.default([]),
	testPrices: z
		.array(testPriceSchema)
		.min(1, "At least one diagnostic test is required")
		.default([]),
	images: z.array(z.string().url("Invalid image URL")).optional().default([]),
	thumbnail: z
		.string()
		.min(1, "Thumbnail is required")
		.url("Invalid thumbnail URL"),
	facilities: z
		.array(z.string().min(1, "Facility is required"))
		.min(1, "At least one facility is required")
		.default([]),
	totalBeds: z
		.number({ required_error: "Total beds is required" })
		.int()
		.positive(),
	established: z
		.number({ required_error: "Established year is required" })
		.int()
		.min(1800, "Established year is invalid")
		.max(new Date().getFullYear(), "Established year is invalid"),
	openHours: openHoursSchema.optional(),
	reviews: z
		.array(reviewSchema)
		.min(2, "At least 2 reviews are required")
		.default([]),
	googleMapReviewLink: z
		.string()
		.min(1, "Google map review link is required")
		.url("Invalid review link"),
	isVerified: z.boolean().default(false),
	isActive: z.boolean().default(true),
	rating: z.number({ required_error: "Rating is required" }).min(0).max(5),
	slug: z.string().optional(),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
