"use server";

import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Place } from "@/models/places.model";
import { createPlaceSchema, updatePlaceSchema } from "@/validators/places";

class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

// ─── Pagination params type ───────────────────────────────────────────────────
export interface GetPlacesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getPlaces(params: GetPlacesParams = {}) {
  try {
    await dbConnect();

    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, params.pageSize ?? 10); // max 100 per page
    const skip = (page - 1) * pageSize;

    // ── Search filter ─────────────────────────────────────────────────────
    // searches in title, category, and location fields
    const filter = params.search
      ? {
          $or: [
            { title: { $regex: params.search, $options: "i" } },
            { category: { $regex: params.search, $options: "i" } },
            { location: { $regex: params.search, $options: "i" } },
          ],
        }
      : {};

    // ── Sort ──────────────────────────────────────────────────────────────
    const sortField = params.sortBy ?? "createdAt";
    const sortDirection = params.sortOrder === "asc" ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    // ── Run query + count in parallel ─────────────────────────────────────
    const [items, totalCount] = await Promise.all([
      Place.find(filter)
        .populate("area", "name")
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Place.countDocuments(filter),
    ]);

    // ── Return shape DataTable expects ────────────────────────────────────
    return {
      items,
      totalCount,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching places:", error);
    throw new ActionError("Failed to fetch places");
  }
}

// ── rest of the actions stay exactly the same ─────────────────────────────────

export async function getPlaceById(id: string) {
  try {
    await dbConnect();
    const place = await Place.findById(id).populate("area", "name").lean();

    if (!place) {
      return { success: false, error: "Place not found" };
    }

    return place;
  } catch (error) {
    console.error("Error fetching place:", error);
    throw new ActionError("Failed to fetch place");
  }
}

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
