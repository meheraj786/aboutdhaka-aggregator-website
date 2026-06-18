"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Place } from "@/models/places.model";
import { createPlaceSchema, updatePlaceSchema } from "@/validators/places";
import "@/models/area.model";

class ActionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ActionError";
	}
}

export interface GetPlacesParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	areas?: string[];
	categories?: string[];
}

export async function getPlaces(params: GetPlacesParams = {}) {
	try {
		await dbConnect();

		const page = Math.max(1, params.page ?? 1);
		const pageSize = Math.min(100, params.pageSize ?? 10);
		const skip = (page - 1) * pageSize;

		const filter: any = {};

		if (params.search) {
			filter.$or = [
				{ title: { $regex: params.search, $options: "i" } },
				{ category: { $regex: params.search, $options: "i" } },
				{ location: { $regex: params.search, $options: "i" } },
			];
		}

		if (params.areas && params.areas.length > 0) {
			// If areas are passed as names, we might need to find their IDs first, 
			// but if the UI sends names and we store names in 'area' field after population,
			// wait, 'area' is an ObjectId in the model. 
			// If the filter is by area name, we need to populate or use aggregation.
			// However, usually it's better to filter by area names if that's what's sent.
			// Let's assume we need to find areas by name first.
		}

		if (params.categories && params.categories.length > 0) {
			filter.category = { $in: params.categories };
		}

		const sortField = params.sortBy ?? "createdAt";
		const sortDirection = params.sortOrder === "asc" ? 1 : -1;
		const sort = { [sortField]: sortDirection } as Record<string, 1 | -1>;

		const [items, totalCount] = await Promise.all([
			Place.find(filter)
				.populate("area", "name")
				.sort(sort)
				.skip(skip)
				.limit(pageSize)
				.lean(),
			Place.countDocuments(filter),
		]);

		return {
			items: JSON.parse(JSON.stringify(items)),
			totalCount,
			currentPage: page,
		};
	} catch (error) {
		console.error("Error fetching places:", error);
		throw new ActionError("Failed to fetch places");
	}
}

export type GetPlacesReturn = Awaited<ReturnType<typeof getPlaces>>;

export async function getPlaceById(id: string) {
	try {
		await dbConnect();
		const place = await Place.findById(id).populate("area", "name").lean();

		if (!place) {
			throw new ActionError("Place not found");
		}

		return place;
	} catch (error) {
		console.error("Error fetching place:", error);
		if (error instanceof ActionError) throw error;
		throw new ActionError("Failed to fetch place");
	}
}
export type GetPlaceByIdReturn = Awaited<ReturnType<typeof getPlaceById>>;

export async function createPlace(payload: unknown) {
	try {
		const data = createPlaceSchema.parse(payload);

		await dbConnect();
		const place = await Place.create(data);
		const plain = place.toObject();
		return {
			success: true,
			message: "Place created successfully",
			data: { ...plain, _id: String(plain._id) },
		};
	} catch (error) {
		console.error("Error creating place:", error);

		if (error instanceof z.ZodError) {
			const message = error.issues.map((issue) => issue.message).join(", ");
			throw new ActionError(`Validation failed: ${message}`);
		}

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to create place");
	}
}

export async function updatePlace(id: string, payload: unknown) {
	try {
		const data = updatePlaceSchema.parse(payload);

		await dbConnect();

		const place = await Place.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
		}).lean();

		if (!place) {
			throw new ActionError("Place not found");
		}

		return {
			success: true,
			message: "Place updated successfully",
			data: place,
		};
	} catch (error) {
		console.error("Error updating place:", error);

		if (error instanceof z.ZodError) {
			const message = error.issues.map((issue) => issue.message).join(", ");
			throw new ActionError(`Validation failed: ${message}`);
		}

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to update place");
	}
}

export async function deletePlace(id: string) {
	try {
		await dbConnect();
		const place = await Place.findByIdAndDelete(id);

		if (!place) {
			throw new ActionError("Place not found");
		}

		return {
			success: true,
			message: "Place deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting place:", error);

		if (error instanceof Error) {
			throw new ActionError(error.message);
		}

		throw new ActionError("Failed to delete place");
	}
}

export async function getRandomPlaces() {
	try {
		await dbConnect();

		const items = await Place.aggregate([
			{ $sample: { size: 3 } }
		]);

		return JSON.parse(JSON.stringify(items)) as any[];
	} catch (error) {
		console.error("Error fetching random places:", error);
		throw new ActionError("Failed to fetch random places");
	}
}