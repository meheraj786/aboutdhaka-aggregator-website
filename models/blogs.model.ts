import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  description?: string;
  image?: string;
  category?: string;
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: String,
    category: String,
  },
  { timestamps: true }
);

export const Blog: Model<IBlog> = mongoose.model<IBlog>('Blog', BlogSchema);