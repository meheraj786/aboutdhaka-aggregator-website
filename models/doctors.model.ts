import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IDoctor extends Document {
	name: string;
	area: mongoose.Types.ObjectId;
	location?: string;
	category: string; // specialization
	detail?: string;
	rating?: number;
	phone?: string;
	fee?: number;
	availableDays?: string[];
	availableTime?: object;
	qualification?: string;
	services?: string[];
	hospitals?: mongoose.Types.ObjectId[];
}

export const modelName = "Doctor";

const DoctorSchema: Schema<IDoctor> = new Schema(
	{
		name: { type: String, required: true },
		area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
		location: String,
		category: String,
		detail: String,
		rating: { type: Number, default: 0 },
		phone: String,
		fee: Number,
		availableDays: [String],
		availableTime: Object,
		qualification: String,
		services: [String],
		hospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }],
	},
	{ timestamps: true },
);

export const Doctor: Model<IDoctor> =
	mongoose.models[modelName] ||
	mongoose.model<IDoctor>(modelName, DoctorSchema);
