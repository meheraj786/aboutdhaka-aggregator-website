import { ArrowLeft, Clock, Tag } from "lucide-react";
import type { Types } from "mongoose";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import BlogContent from "@/components/appComponents/BlogContent";
import ShareButtons from "@/components/appComponents/ShareButtons";
import { Badge } from "@/components/ui/badge";
import { dbConnect } from "@/lib/db";
import Blog, { type IBlog } from "@/models/blogs.model";

interface BlogDetailPageProps {
	params: Promise<{ slug: string }>;
}

type BlogDoc = IBlog & { _id: Types.ObjectId; createdAt: Date };

async function getBlogBySlugOrId(slugOrId: string): Promise<BlogDoc | null> {
	await dbConnect();

	const blog =
		(await Blog.findOne({ slug: slugOrId, isActive: true }).lean<BlogDoc>()) ??
		(await Blog.findOne({ _id: slugOrId, isActive: true })
			.lean<BlogDoc>()
			.catch(() => null));

	return blog;
}

async function getRelatedBlogs(
	category: string,
	excludeId: Types.ObjectId,
): Promise<BlogDoc[]> {
	return Blog.find({
		category,
		isActive: true,
		_id: { $ne: excludeId },
	})
		.sort({ createdAt: -1 })
		.limit(6)
		.lean<BlogDoc[]>();
}

// ── SEO: generateMetadata ─────────────────────────────────────────────────────

const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL ?? "https://aboutdhaka.vercel.app";

export async function generateMetadata({
	params,
}: BlogDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const blog = await getBlogBySlugOrId(slug);

	if (!blog) {
		return {
			title: "Blog not found",
			description: "This blog post does not exist.",
		};
	}

	const plainDescription = blog.description
		.replace(/<[^>]*>/g, "")
		.slice(0, 160);

	const url = `${BASE_URL}/blogs/${blog.slug ?? String(blog._id)}`;

	return {
		title: blog.title,
		description: plainDescription,
		openGraph: {
			type: "article",
			url,
			title: blog.title,
			description: plainDescription,
			images: blog.imageUrl
				? [{ url: blog.imageUrl, width: 1200, height: 630, alt: blog.title }]
				: [],
			publishedTime: blog.createdAt.toISOString(),
			section: blog.category,
		},
		twitter: {
			card: "summary_large_image",
			title: blog.title,
			description: plainDescription,
			images: blog.imageUrl ? [blog.imageUrl] : [],
		},
		alternates: { canonical: url },
	};
}

// ── Sidebar card ──────────────────────────────────────────────────────────────

function SidebarBlogCard({ blog }: { blog: BlogDoc }) {
	const href = `/blogs/${blog.slug ?? String(blog._id)}`;
	const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return (
		<Link href={href} className="group flex gap-3 items-start">
			<div className="relative h-16 w-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
				{blog.imageUrl ? (
					<Image
						src={blog.imageUrl}
						alt={blog.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						unoptimized
					/>
				) : (
					<div className="h-full w-full flex items-center justify-center">
						<Tag className="h-5 w-5 text-slate-300" />
					</div>
				)}
			</div>
			<div className="flex flex-col gap-1 min-w-0">
				<p className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
					{blog.title}
				</p>
				<div className="flex items-center gap-2 text-xs text-slate-400">
					{blog.readingMin && (
						<span className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{blog.readingMin} min
						</span>
					)}
					<span>· {formattedDate}</span>
				</div>
			</div>
		</Link>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
	const { slug } = await params;
	const blog = await getBlogBySlugOrId(slug);

	if (!blog) notFound();

	const related = await getRelatedBlogs(blog.category, blog._id);

	const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const pageUrl = `${BASE_URL}/blogs/${blog.slug ?? String(blog._id)}`;
	const plainDescription = blog.description
		.replace(/<[^>]*>/g, "")
		.slice(0, 160);

	return (
		<>
			<Script id="blog-jsonld" type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: blog.title,
					description: plainDescription,
					image: blog.imageUrl ? [blog.imageUrl] : undefined,
					datePublished: blog.createdAt.toISOString(),
					articleSection: blog.category,
					url: pageUrl,
				})}
			</Script>

			<div className="min-h-screen bg-slate-50/30">
				<main className="py-12 px-6 md:px-12 lg:px-24">
					<div className="max-w-7xl mx-auto">
						{/* Back */}
						<Link
							href="/blogs"
							className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors mb-8"
						>
							<ArrowLeft className="h-4 w-4" /> Back to blogs
						</Link>

						<div className="flex flex-col lg:flex-row gap-12">
							{/* ── Main content ── */}
							<article className="flex-1 min-w-0 space-y-8">
								{/* Cover image */}
								{blog.imageUrl && (
									<div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-slate-100">
										<Image
											src={blog.imageUrl}
											alt={blog.title}
											fill
											className="object-cover"
											unoptimized
										/>
									</div>
								)}

								{/* Meta */}
								<div className="flex flex-wrap items-center gap-3">
									<Badge className="bg-blue-50 text-blue-700 border-0 flex items-center gap-1">
										<Tag className="h-3 w-3" />
										{blog.category}
									</Badge>
									{blog.isAdminPost && (
										<Badge className="bg-blue-600 text-white border-0 text-xs">
											Official
										</Badge>
									)}
									<span className="flex items-center gap-1 text-xs text-slate-400">
										<Clock className="h-3 w-3" />
										{blog.readingMin} min read
									</span>
									<span className="text-xs text-slate-400">
										· {formattedDate}
									</span>
								</div>

								{/* Title */}
								<h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
									{blog.title}
								</h1>

								{/* Share buttons — below title */}
								<ShareButtons
									url={pageUrl}
									title={blog.title}
									description={plainDescription}
								/>

								{/* Rich text body */}
								<BlogContent
									html={blog.description}
									className="prose prose-slate prose-img:rounded-xl prose-a:text-blue-600 prose-headings:font-bold max-w-none"
								/>

								{/* Share buttons — repeated at bottom for convenience */}
								<div className="pt-4 border-t border-slate-100">
									<p className="text-sm text-slate-500 mb-3 font-medium">
										Found this helpful? Share it:
									</p>
									<ShareButtons
										url={pageUrl}
										title={blog.title}
										description={plainDescription}
									/>
								</div>
							</article>

							{/* ── Sidebar ── */}
							<aside className="w-full lg:w-80 shrink-0">
								<div className="sticky top-6 space-y-6">
									<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
										<div className="flex items-center justify-between">
											<h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
												More in {blog.category}
											</h2>
											<Link
												href={`/blogs?category=${encodeURIComponent(blog.category)}`}
												className="text-xs text-blue-600 hover:underline font-medium"
											>
												View all
											</Link>
										</div>

										{related.length > 0 ? (
											<div className="space-y-4 divide-y divide-slate-100">
												{related.map((r) => (
													<div key={String(r._id)} className="pt-4 first:pt-0">
														<SidebarBlogCard blog={r} />
													</div>
												))}
											</div>
										) : (
											<p className="text-sm text-slate-400 text-center py-6">
												No other blogs in this category yet.
											</p>
										)}
									</div>
								</div>
							</aside>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
