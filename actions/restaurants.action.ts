"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Restaurant } from "@/models/restaurants.model";
import { createRestaurantSchema, updateRestaurantSchema } from "@/validators/restaurants";
import "@/models/area.model";

export interface GetRestaurantsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  areas?: string[];
  categories?: string[];
  experiences?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getRestaurants(params: GetRestaurantsParams = {}) {
  try {
    await dbConnect();
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, params.pageSize ?? 10);
    const skip = (page - 1) * pageSize;

    const filter: any = {};

    if (params.search) {
      filter.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { category: { $regex: params.search, $options: "i" } },
        { location: { $regex: params.search, $options: "i" } },
      ];
    }

    if (params.areas && params.areas.length > 0) {
      const { Area } = await import("@/models/area.model");
      const areas = await Area.find({ name: { $in: params.areas } })
        .select("_id")
        .lean();
      const areaIds = areas.map((a: any) => a._id);
      if (areaIds.length === 0) {
        return { items: [], totalCount: 0, currentPage: page };
      }
      filter.area = { $in: areaIds };
    }

    if (params.categories && params.categories.length > 0) {
      filter.category = { $in: params.categories };
    }

    if (params.experiences && params.experiences.length > 0) {
      filter.experience = { $in: params.experiences };
    }

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

    return {
      items: JSON.parse(JSON.stringify(items)),
      totalCount,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw new Error("Failed to fetch restaurants");
  }
}

export type GetRestaurantsReturn = Awaited<ReturnType<typeof getRestaurants>>;

export async function createRestaurant(payload: unknown) {
  try {
    const data = createRestaurantSchema.parse(payload);
    await dbConnect();
    const res = await Restaurant.create(data);
    return { success: true, data: JSON.parse(JSON.stringify(res)) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }
    console.error("Create restaurant error:", error);
    throw new Error("Failed to create restaurant");
  }
}

export async function deleteRestaurant(id: string) {
  try {
    await dbConnect();
    await Restaurant.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error("Delete restaurant error:", error);
    throw new Error("Failed to delete restaurant");
  }
}

export async function getRestaurantById(id: string) {
  try {
    await dbConnect();
    const res = await Restaurant.findById(id).populate("area").lean();
    if (!res) throw new Error("Restaurant not found");
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error("Get restaurant by id error:", error);
    throw new Error("Failed to fetch restaurant");
  }
}

export type GetRestaurantByIdReturn = Awaited<ReturnType<typeof getRestaurantById>>;

export async function updateRestaurant(id: string, payload: unknown) {
  try {
    await dbConnect();
    const validated = updateRestaurantSchema.parse(payload);

    // Remove any fields that are undefined (optional)
    const cleaned = Object.fromEntries(
      Object.entries(validated).filter(([_, v]) => v !== undefined)
    );

    const updated = await Restaurant.findByIdAndUpdate(
      id,
      { $set: cleaned },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    )
      .populate("area")
      .lean();

    if (!updated) {
      throw new Error("Restaurant not found");
    }

    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.issues[0].message}`);
    }
    console.error("Update restaurant error:", error);
    throw new Error("Failed to update restaurant");
  }
}

export async function getRandomRestaurants(size: number = 4) {
  try {
    await dbConnect();
    const items = await Restaurant.aggregate([
      { $sample: { size } },
      {
        $lookup: {
          from: "areas",
          localField: "area",
          foreignField: "_id",
          as: "area",
        },
      },
      { $unwind: { path: "$area", preserveNullAndEmptyArrays: true } },
    ]);
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Random restaurants error:", error);
    throw new Error("Failed to fetch random restaurants");
  }
}