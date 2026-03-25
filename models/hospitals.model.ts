import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IHospital extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location?: string;
	category: string;
	detail?: string;
	rating?: number;
	phone?: string;
	testPrices?: object;
	services?: string[];
	reviewsCount?: number;
	doctors?: mongoose.Types.ObjectId[];
}

const HospitalSchema: Schema<IHospital> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: String,
		category: String,
		detail: String,
		rating: { type: Number, default: 0 },
		phone: String,
		testPrices: Object,
		services: [String],
		reviewsCount: { type: Number, default: 0 },
		doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
	},
	{ timestamps: true },
);

export const Hospital: Model<IHospital> = mongoose.model<IHospital>(
	"Hospital",
	HospitalSchema,
);
