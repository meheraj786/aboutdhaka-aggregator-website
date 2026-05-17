import { z } from "zod";

export const BLOG_CATEGORIES = [
	"Health Tips",
	"Disease Awareness",
	"Nutrition",
	"Mental Health",
	"Medical News",
	"Lifestyle",
	"Child Health",
	"Women Health",
	"Senior Care",
	"Emergency Care",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const createBlogSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	slug: z.string().optional(),
	category: z.enum(BLOG_CATEGORIES, {
		message: "Please select a valid category",
	}),
	readingMin: z.coerce
		.number()
		.int()
		.min(1, "Reading time must be at least 1 minute")
		.max(120)
		.default(5),
	authorId: z.string().optional(),
	isAdminPost: z.boolean().default(true),
	imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
	description: z.string().min(10, "Description must be at least 10 characters"),
	isActive: z.boolean().default(true),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
