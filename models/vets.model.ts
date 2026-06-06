import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IVet extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location: string;
	category: string;
	detail?: string;
	rating?: number;
	phone?: string;
	services?: string[];
	reviewsCount?: number;
}

export const modelName = "Vet";

const VetSchema: Schema<IVet> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: { type: String, required: true },
		category: String,
		detail: String,
		rating: { type: Number, default: 0 },
		phone: String,
		services: [String],
		reviewsCount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

export const Vet: Model<IVet> =
	mongoose.models[modelName] || mongoose.model<IVet>(modelName, VetSchema);
