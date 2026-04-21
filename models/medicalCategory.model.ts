import mongoose, { type Document, type Model, Schema } from "mongoose";

export type MedicalCategoryType = "hospital" | "doctor";

export interface IMedicalCategory extends Document {
	name: string;
	slug: string;
	type: MedicalCategoryType;
	description?: string;
	icon?: string;
	isActive: boolean;
}

export const modelName = "MedicalCategory";

const categorySchema: Schema<IMedicalCategory> = new Schema(
	{
		name: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, trim: true },
		type: {
			type: String,
			required: true,
			enum: ["hospital", "doctor"],
		},
		description: { type: String },
		icon: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

categorySchema.index({ type: 1, slug: 1 });

export const MedicalCategory: Model<IMedicalCategory> =
	mongoose.models[modelName] ||
	mongoose.model<IMedicalCategory>(modelName, categorySchema);

export default MedicalCategory;
