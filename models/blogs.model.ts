import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IBlog extends Document {
	title: string;
	description?: string;
	image?: string;
	category?: string;
}

const modelName = "Blog";

const BlogSchema: Schema<IBlog> = new Schema(
	{
		title: { type: String, required: true },
		description: String,
		image: String,
		category: String,
	},
	{ timestamps: true },
);

export const Blog: Model<IBlog> =
	mongoose.models[modelName] || mongoose.model<IBlog>(modelName, BlogSchema);
