// import mongoose, { type Document, type Model, Schema } from "mongoose";

// export interface IBlog extends Document {
// 	title: string;
// 	description?: string;
// 	image?: string;
// 	category?: string;
// }

// const modelName = "Blog";

// const BlogSchema: Schema<IBlog> = new Schema(
// 	{
// 		title: { type: String, required: true },
// 		description: String,
// 		image: String,
// 		category: String,
// 	},
// 	{ timestamps: true },
// );

// export const Blog: Model<IBlog> =
// mongoose.models[modelName] || mongoose.model<IBlog>(modelName, BlogSchema);
import mongoose, { Model, Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  coverImage?: string;
  slug: string;
  excerpt: string;
  //syterm author (admin/user)
  createdBy: mongoose.Types.ObjectId;
  //   custom author(override)
  authorName?: string;
  authorImage?: string;
  authorBio?: string;
  category?: string;
  tags: string;
  viwer: number;
  isPublish: boolean;
  status: "draft" | "pending" | "approved";
  publishdAt?: Date;
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String },
    authorImage: { type: String },
    authorBio: { type: String },
    category: { type: String },
    tags: [String],
    viwer: { type: Number, default: 0 },
    isPublish: {
      type: Boolean,

      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved"],
      default: "draft",
    },
    publishdAt: { types: Date },
  },
  { timestamps: true },
);
export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
