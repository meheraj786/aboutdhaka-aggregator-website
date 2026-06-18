"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Blog } from "@/models";
import { ensureBlogIndexes } from "@/models/blogs.model";
import { type BlogCategory, createBlogSchema } from "@/validators/blogs";

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const isMongoDuplicateKeyError = (
	error: unknown,
): error is Error & { code: number; keyPattern?: Record<string, number> } =>
	typeof error === "object" &&
	error !== null &&
	"code" in error &&
	(error as { code?: unknown }).code === 11000;

const buildUniqueBlogSlug = async (
	title: string,
	providedSlug?: string,
	excludeId?: string,
) => {
	const baseSlug = slugify(providedSlug || title) || `blog-${Date.now()}`;
	let candidateSlug = baseSlug;
	let suffix = 1;

	while (
		await Blog.exists(
			excludeId
				? { slug: candidateSlug, _id: { $ne: excludeId } }
				: { slug: candidateSlug },
		)
	) {
		candidateSlug = `${baseSlug}-${suffix}`;
		suffix += 1;
	}

	return candidateSlug;
};

export interface GetBlogsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	category?: BlogCategory | "all";
	isActive?: boolean;
}

export async function getBlogs(params: GetBlogsParams = {}) {
	try {
		await dbConnect();

		const page = Math.max(1, params.page ?? 1);
		const pageSize = params.pageSize ?? 10;
		const skip = (page - 1) * pageSize;

		// Build filter
		const filter: Record<string, unknown> = {};

		if (params.search) {
			filter.title = { $regex: params.search, $options: "i" };
		}

		// category filter — "all" or undefined means no filter
		if (params.category && params.category !== "all") {
			filter.category = params.category;
		}

		if (typeof params.isActive === "boolean") {
			filter.isActive = params.isActive;
		}

		const [items, totalCount] = await Promise.all([
			Blog.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(pageSize)
				.lean(),
			Blog.countDocuments(filter),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: page,
		};
	} catch {
		throw new Error("Failed to fetch blogs");
	}
}

export async function getBlogById(id: string) {
	try {
		await dbConnect();
		const res = await Blog.findById(id).lean();
		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch {
		throw new Error("Failed to fetch blog");
	}
}

export async function createBlog(payload: unknown) {
	try {
		const data = createBlogSchema.parse(payload);

		await dbConnect();
		await ensureBlogIndexes();

		const generatedSlug = await buildUniqueBlogSlug(data.title, data.slug);

		const res = await Blog.create({
			title: data.title,
			slug: generatedSlug,
			category: data.category,
			readingMin: data.readingMin,
			authorId: data.authorId,
			isAdminPost: data.isAdminPost,
			imageUrl: data.imageUrl || undefined,
			description: data.description,
			isActive: data.isActive,
		});

		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch (error) {
		if (error instanceof z.ZodError) throw new Error(error.issues[0].message);
		if (isMongoDuplicateKeyError(error)) {
			if (error.keyPattern?.slug) {
				throw new Error(
					"A blog with a similar title already exists. Please change the title.",
				);
			}
			throw new Error("A blog with the same unique details already exists.");
		}
		if (error instanceof Error) {
			console.error("Create blog error:", error);
			throw new Error(error.message || "Failed to create blog");
		}
		throw new Error("Failed to create blog");
	}
}

export async function updateBlog(id: string, payload: unknown) {
	try {
		const data = createBlogSchema.parse(payload);

		await dbConnect();
		await ensureBlogIndexes();

		const generatedSlug = await buildUniqueBlogSlug(data.title, data.slug, id);

		const res = await Blog.findByIdAndUpdate(
			id,
			{
				title: data.title,
				slug: generatedSlug,
				category: data.category,
				readingMin: data.readingMin,
				authorId: data.authorId,
				isAdminPost: data.isAdminPost,
				imageUrl: data.imageUrl || undefined,
				description: data.description,
				isActive: data.isActive,
			},
			{ new: true, runValidators: true },
		);

		if (!res) throw new Error("Blog not found");

		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch (error) {
		if (error instanceof z.ZodError) throw new Error(error.issues[0].message);
		if (isMongoDuplicateKeyError(error)) {
			if (error.keyPattern?.slug) {
				throw new Error(
					"A blog with a similar title already exists. Please change the title.",
				);
			}
			throw new Error("A blog with the same unique details already exists.");
		}
		if (error instanceof Error) {
			console.error("Update blog error:", error);
			throw new Error(error.message || "Failed to update blog");
		}
		throw new Error("Failed to update blog");
	}
}

export async function deleteBlog(id: string) {
	try {
		await dbConnect();
		const blog = await Blog.findById(id).lean();
		if (!blog) throw new Error("Blog not found");
		await Blog.findByIdAndDelete(id);
		return { success: true };
	} catch (error) {
		console.error("Delete blog error:", error);
		throw new Error("Failed to delete blog");
	}
}

export async function getRecentBlogs() {
	try {
		await dbConnect();
		const items = await Blog.find({ isActive: true })
			.sort({ createdAt: -1 })
			.limit(4)
			.lean();

		return JSON.parse(JSON.stringify(items));
	} catch (error) {
		console.error("Error fetching recent blogs:", error);
		throw new Error("Failed to fetch recent blogs");
	}
}

export type GetBlogsReturn = Awaited<ReturnType<typeof getBlogs>>;
