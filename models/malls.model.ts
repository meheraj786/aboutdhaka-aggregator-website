import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IMall extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location: string; // ← string
	category: string;
	detail?: string;
	rating?: number;
	phone?: string;
	menu?: object;
	famousFor?: string;
	facilities?: string[];
	popularShops?: string[];
	gallery?: string[];
	reviewsCount?: number;
}

export const modelName = "Mall";

const MallSchema: Schema<IMall> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: { type: String, required: true }, // ← string
		category: String,
		detail: String,
		rating: { type: Number, default: 0 },
		phone: String,
		menu: Object,
		famousFor: String,
		facilities: [String],
		popularShops: [String],
		gallery: [String],
		reviewsCount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

export const Mall: Model<IMall> =
	mongoose.models[modelName] || mongoose.model<IMall>(modelName, MallSchema);
