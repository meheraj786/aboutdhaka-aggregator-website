"use server";

import { dbConnect } from "@/lib/db";
import { Place } from "@/models/places.model";
import { createPlaceSchema, updatePlaceSchema } from "@/validators/places";
import { z } from "zod";

// Custom Error Class
class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export async function getPlaces() {
  try {
    await dbConnect();
    const places = await Place.find({})
      .populate("area", "name")
      .sort({ createdAt: -1 })
      .lean();

    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw new ActionError("Failed to fetch places");
  }
}

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

    return {
      success: true,
      message: "Place created successfully",
      data: place,
    };
  } catch (error) {
    console.error("Error creating place:", error);

    if (error instanceof z.ZodError) {
      const message = error.issues
        .map((issue) => issue.message)
        .join(", ");
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
      const message = error.issues
        .map((issue) => issue.message)
        .join(", ");
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
      message: "Place deleted successfully" 
    };
  } catch (error) {
    console.error("Error deleting place:", error);

    if (error instanceof Error) {
      throw new ActionError(error.message);
    }

    throw new ActionError("Failed to delete place");
  }
}