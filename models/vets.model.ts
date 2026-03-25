import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IVet extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location: string; // ← string
	category: string;
	detail?: string;
	rating?: number;
	phone?: string;
	services?: string[];
	reviewsCount?: number;
}

const VetSchema: Schema<IVet> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: { type: String, required: true }, // ← string
		category: String,
		detail: String,
		rating: { type: Number, default: 0 },
		phone: String,
		services: [String],
		reviewsCount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

export const Vet: Model<IVet> = mongoose.model<IVet>("Vet", VetSchema);
