import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IBus extends Document {
	name: string;
	category?: string;
	rating?: number;
	reviewsCount?: number;
	stopages?: string[];
}

const modelName = "Bus";

const BusSchema: Schema<IBus> = new Schema(
	{
		name: { type: String, required: true },
		category: String,
		rating: { type: Number, default: 0 },
		reviewsCount: { type: Number, default: 0 },
		stopages: [String],
	},
	{ timestamps: true },
);

export const Bus: Model<IBus> =
	mongoose.models[modelName] || mongoose.model<IBus>(modelName, BusSchema);
