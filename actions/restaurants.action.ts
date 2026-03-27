"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Restaurant } from "@/models/restaurants.model";
import { createRestaurantSchema } from "@/validators/restaurants";

export interface GetRestaurantsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export async function getRestaurants(params: GetRestaurantsParams = {}) {
	try {
		await dbConnect();
		const page = Math.max(1, params.page ?? 1);
		const pageSize = Math.min(100, params.pageSize ?? 10);
		const skip = (page - 1) * pageSize;

		const filter = params.search
			? {
					$or: [
						{ name: { $regex: params.search, $options: "i" } },
						{ category: { $regex: params.search, $options: "i" } },
						{ location: { $regex: params.search, $options: "i" } },
					],
				}
			: {};

		const sortField = params.sortBy ?? "createdAt";
		const sortDirection = params.sortOrder === "asc" ? 1 : -1;

		const [items, totalCount] = await Promise.all([
			Restaurant.find(filter)
				.populate("area", "name")
				.sort({ [sortField]: sortDirection })
				.skip(skip)
				.limit(pageSize)
				.lean(),
			Restaurant.countDocuments(filter),
		]);

		return { items, totalCount, currentPage: page };
	} catch (_) {
		throw new Error("Failed to fetch restaurants");
	}
}

export async function createRestaurant(payload: unknown) {
	try {
		const data = createRestaurantSchema.parse(payload);
		await dbConnect();
		const res = await Restaurant.create(data);
		return { success: true, data: JSON.parse(JSON.stringify(res)) };
	} catch (error) {
		if (error instanceof z.ZodError) throw new Error(error.issues[0].message);
		throw new Error("Failed to create restaurant");
	}
}

export async function deleteRestaurant(id: string) {
	try {
		await dbConnect();
		await Restaurant.findByIdAndDelete(id);
		return { success: true };
	} catch (_) {
		throw new Error("Failed to delete restaurant");
	}
}

export async function getRestaurantById(id: string) {
	await dbConnect();
	const res = await Restaurant.findById(id).populate("area", "name").lean();
	return JSON.parse(JSON.stringify(res));
}

export type GetRestaurantByIdReturn = Awaited<
	ReturnType<typeof getRestaurantById>
>;
