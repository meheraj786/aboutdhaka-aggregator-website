import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IRestaurant extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location: string; // ← string
	category: string;
	detail?: string;
	rating?: number;
	phone?: string;
	menu?: object;
	amenities?: string[];
	hours?: object;
	gallery?: string[];
	reviewsCount?: number;
}

export const modelName = "Restaurant";

const RestaurantSchema: Schema<IRestaurant> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: { type: String, required: true }, // ← string
		category: String,
		detail: String,
		rating: { type: Number, default: 0, min: 0, max: 5 },
		phone: String,
		menu: Object,
		amenities: [String],
		hours: Object,
		gallery: [String],
		reviewsCount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

export const Restaurant: Model<IRestaurant> =
	mongoose.models[modelName] ||
	mongoose.model<IRestaurant>(modelName, RestaurantSchema);
