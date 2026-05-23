import mongoose, { type Model, Schema } from "mongoose";

export interface IShop extends mongoose.Document {
	name: string;
	location: string;
	lat?: number;
	long?: number;
	rating?: number;
	website?: string;
	phone?: string;
	createdAt: Date;
	updatedAt: Date;
}

const ShopSchema = new Schema<IShop>(
	{
		name: { type: String, required: true, unique: true },
		location: { type: String, required: true },
		lat: { type: Number },
		long: { type: Number },
		rating: { type: Number, default: 0 },
		website: { type: String },
		phone: { type: String },
	},
	{ timestamps: true },
);

const modelName = "Shop";
export const Shop: Model<IShop> =
	mongoose.models[modelName] || mongoose.model<IShop>(modelName, ShopSchema);
