import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IRent extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location: string; // ← string
	category: string;
	detail?: string;
	rating?: number;
	amenities?: string[];
	gallery?: string[];
	phone?: string;
	sizeSqft?: number;
	price?: number;
}

const RentSchema: Schema<IRent> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: { type: String, required: true }, // ← string
		category: String,
		detail: String,
		rating: { type: Number, default: 0 },
		amenities: [String],
		gallery: [String],
		phone: String,
		sizeSqft: Number,
		price: Number,
	},
	{ timestamps: true },
);

export const Rent: Model<IRent> = mongoose.model<IRent>("Rent", RentSchema);
