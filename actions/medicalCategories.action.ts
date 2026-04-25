"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { MedicalCategory } from "@/models/medicalCategory.model";
import {
	createMedicalCategorySchema,
	updateMedicalCategorySchema,
} from "@/validators/medicalCategories";

class ActionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ActionError";
	}
}

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const buildUniqueCategorySlug = async (name: string, providedSlug?: string) => {
	const baseSlug = slugify(providedSlug || name) || `category-${Date.now()}`;
	let candidateSlug = baseSlug;
	let suffix = 1;

	while (await MedicalCategory.exists({ slug: candidateSlug })) {
		candidateSlug = `${baseSlug}-${suffix}`;
		suffix += 1;
	}

	return candidateSlug;
};

export interface GetMedicalCategoriesParams {
	page?: number;
	pageSize?: number;
	search?: string;
	type?: "hospital" | "doctor";
	isActive?: boolean;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export async function getMedicalCategories(
	params: GetMedicalCategoriesParams = {},
) {
	try {
		await dbConnect();

		const page = Math.max(1, params.page ?? 1);
		const pageSize = Math.min(100, params.pageSize ?? 10);
		const skip = (page - 1) * pageSize;

		const filter: Record<string, unknown> = {};

		if (params.search) {
			filter.$or = [
				{ name: { $regex: params.search, $options: "i" } },
				{ description: { $regex: params.search, $options: "i" } },
			];
		}

		if (params.type) {
			filter.type = params.type;
		}

		if (params.isActive !== undefined) {
			filter.isActive = params.isActive;
		}

		const sortField = params.sortBy ?? "createdAt";
		const sortDirection = params.sortOrder === "asc" ? 1 : -1;
		const sort = { [sortField]: sortDirection } as Record<string, 1 | -1>;

		const [items, totalCount] = await Promise.all([
			MedicalCategory.find(filter).sort(sort).skip(skip).limit(pageSize).lean(),
			MedicalCategory.countDocuments(filter),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: page,
		};
	} catch (error) {
		console.error("Error fetching medical categories:", error);
		throw new ActionError("Failed to fetch medical categories");
	}
}

export type GetMedicalCategoriesReturn = Awaited<
	ReturnType<typeof getMedicalCategories>
>;

export async function getMedicalCategoryById(id: string) {
	try {
		await dbConnect();
		const category = await MedicalCategory.findById(id).lean();

		if (!category) {
			throw new ActionError("Medical category not found");
		}

		return JSON.parse(JSON.stringify(category));
	} catch (error) {
		console.error("Error fetching medical category:", error);
		if (error instanceof ActionError) throw error;
		throw new ActionError("Failed to fetch medical category");
	}
}

export type GetMedicalCategoryByIdReturn = Awaited<
	ReturnType<typeof getMedicalCategoryById>
>;

export async function createMedicalCategory(payload: unknown) {
	try {
		const data = createMedicalCategorySchema.parse(payload);

		await dbConnect();

		const generatedSlug = await buildUniqueCategorySlug(data.name, data.slug);

		const categoryData = {
			name: data.name,
			slug: generatedSlug,
			type: data.type,
			description: data.description,
			icon: data.icon,
			isActive: data.isActive,
		};

		const category = await MedicalCategory.create(categoryData);
		const plain = category.toObject();

		return {
			success: true,
			message: "Medical category created successfully",
			data: { ...plain, _id: String(plain._id) },
		};
	} catch (error) {
		console.error("Error creating medical category:", error);

		if (error instanceof z.ZodError) {
			const message = error.issues.map((issue) => issue.message).join(", ");
			throw new ActionError(`Validation failed: ${message}`);
		}

		if (
			error instanceof Error &&
			"code" in error &&
			(error as { code: number }).code === 11000
		) {
			throw new ActionError("A medical category with this slug already exists");
		}

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to create medical category");
	}
}

export async function updateMedicalCategory(id: string, payload: unknown) {
	try {
		const data = updateMedicalCategorySchema.parse(payload);

		await dbConnect();

		// If name or slug is being updated, regenerate slug
		let updateData = { ...data };
		if (data.name || data.slug) {
			const currentCategory = await MedicalCategory.findById(id);
			if (!currentCategory) {
				throw new ActionError("Medical category not found");
			}

			const newName = data.name || currentCategory.name;
			const generatedSlug = await buildUniqueCategorySlug(newName, data.slug);
			updateData = { ...updateData, slug: generatedSlug };
		}

		const category = await MedicalCategory.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		}).lean();

		if (!category) {
			throw new ActionError("Medical category not found");
		}

		return {
			success: true,
			message: "Medical category updated successfully",
			data: JSON.parse(JSON.stringify(category)),
		};
	} catch (error) {
		console.error("Error updating medical category:", error);

		if (error instanceof z.ZodError) {
			const message = error.issues.map((issue) => issue.message).join(", ");
			throw new ActionError(`Validation failed: ${message}`);
		}

		if (
			error instanceof Error &&
			"code" in error &&
			(error as { code: number }).code === 11000
		) {
			throw new ActionError("A medical category with this slug already exists");
		}

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to update medical category");
	}
}

export async function deleteMedicalCategory(id: string) {
	try {
		await dbConnect();
		const category = await MedicalCategory.findByIdAndDelete(id);

		if (!category) {
			throw new ActionError("Medical category not found");
		}

		return {
			success: true,
			message: "Medical category deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting medical category:", error);

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to delete medical category");
	}
}

export async function getMedicalCategoriesByType(type: "hospital" | "doctor") {
	try {
		await dbConnect();
		const categories = await MedicalCategory.find({
			type,
			isActive: true,
		})
			.sort({ name: 1 })
			.lean();

		return JSON.parse(JSON.stringify(categories));
	} catch (error) {
		console.error("Error fetching medical categories by type:", error);
		throw new ActionError("Failed to fetch medical categories by type");
	}
}

export type GetMedicalCategoriesByTypeReturn = Awaited<
	ReturnType<typeof getMedicalCategoriesByType>
>;
