import mongoose, { type Document, type Model, Schema } from "mongoose";
import { BLOG_CATEGORIES, type BlogCategory } from "@/validators/blogs";

export interface IBlog extends Document {
	title: string;
	slug?: string;
	category: BlogCategory;
	readingMin: number;
	authorId?: string;
	isAdminPost: boolean;
	imageUrl?: string;
	description: string;
	isActive: boolean;
}

export const modelName = "Blog";

let blogIndexesEnsured = false;

const slugifyBlogTitle = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const blogSchema: Schema<IBlog> = new Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, unique: true, trim: true },
		category: {
			type: String,
			enum: BLOG_CATEGORIES,
			required: true,
		},
		readingMin: { type: Number, default: 5, min: 1, max: 120 },
		authorId: { type: String },
		isAdminPost: { type: Boolean, default: true },
		imageUrl: { type: String },
		description: { type: String, required: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

blogSchema.index({ title: "text", category: "text" });
blogSchema.index({ category: 1 });
blogSchema.index({ isActive: 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models[modelName]) {
	delete mongoose.models[modelName];
}

export const Blog: Model<IBlog> =
	(mongoose.models[modelName] as Model<IBlog>) ||
	mongoose.model<IBlog>(modelName, blogSchema);

async function backfillMissingBlogSlugs() {
	const blogsWithoutSlugs = await Blog.find({
		$or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
	})
		.select("_id title slug")
		.sort({ createdAt: 1 })
		.lean();

	for (const blog of blogsWithoutSlugs) {
		const baseSlug = slugifyBlogTitle(blog.title || "") || `blog-${blog._id}`;
		let candidateSlug = baseSlug;
		let suffix = 1;

		while (await Blog.exists({ slug: candidateSlug, _id: { $ne: blog._id } })) {
			candidateSlug = `${baseSlug}-${suffix}`;
			suffix += 1;
		}

		await Blog.updateOne({ _id: blog._id }, { $set: { slug: candidateSlug } });
	}
}

export async function ensureBlogIndexes() {
	if (blogIndexesEnsured) return;

	const existingIndexes = await Blog.collection.indexes();
	const hasSlugIndex = existingIndexes.some((index) => index.name === "slug_1");

	if (hasSlugIndex) {
		blogIndexesEnsured = true;
		return;
	}

	await backfillMissingBlogSlugs();
	await Blog.syncIndexes();
	blogIndexesEnsured = true;
}

export default Blog;
