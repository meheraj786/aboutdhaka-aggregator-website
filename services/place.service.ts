import { dbConnect } from "@/lib/db";
import { Place } from "@/models/places.model";
import type { CreatePlaceInput, UpdatePlaceInput } from "@/validators/places";

type query = {
	area?: string;
	category?: string;
};

export const placeService = {
	async getPlaces(areaId?: string, category?: string) {
		await dbConnect();
		const query: query = {};

		if (areaId) query.area = areaId;
		if (category) query.category = category;

		return Place.find(query)
			.populate("area", "name")
			.sort({ rating: -1, createdAt: -1 })
			.lean();
	},

	// Get single place by ID
	async getPlaceById(id: string) {
		await dbConnect();
		return Place.findById(id).populate("area", "name").lean();
	},

	// Create new place
	async createPlace(data: CreatePlaceInput) {
		await dbConnect();
		return Place.create(data);
	},

	// Update place
	async updatePlace(id: string, data: UpdatePlaceInput) {
		await dbConnect();
		return Place.findByIdAndUpdate(id, data, { new: true });
	},

	// Delete place
	async deletePlace(id: string) {
		await dbConnect();
		return Place.findByIdAndDelete(id);
	},
};
