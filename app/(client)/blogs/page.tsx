import Link from "next/link";
import { getBlogs } from "@/actions/blogs.action";
import BlogCard from "@/components/appComponents/BlogCard";
import { cn } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@/validators/blogs";

interface BlogsPageProps {
	searchParams: Promise<{
		page?: string;
		category?: string;
		search?: string;
	}>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
	const { page, category, search } = await searchParams;

	const currentPage = Number(page ?? 1);
	const pageSize = 9;
	const activeCategory = category ?? "all";

	const {
		items,
		totalCount,
		currentPage: cp,
	} = await getBlogs({
		page: currentPage,
		pageSize,
		search,
		category: activeCategory === "all" ? "all" : (activeCategory as never),
		isActive: true,
	});

	const totalPages = Math.ceil(totalCount / pageSize);

	// Build URL helper — preserves existing params
	const buildUrl = (overrides: Record<string, string | undefined>) => {
		const params = new URLSearchParams();
		if (search) params.set("search", search);
		if (activeCategory !== "all") params.set("category", activeCategory);
		params.set("page", String(currentPage));
		for (const [k, v] of Object.entries(overrides)) {
			if (v === undefined) params.delete(k);
			else params.set(k, v);
		}
		return `/blogs?${params.toString()}`;
	};

	return (
		<div className="min-h-screen flex flex-col bg-slate-50/30">
			<main className="flex-grow py-12 px-6 md:px-12 lg:px-24">
				<div className="max-w-7xl mx-auto space-y-10">
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
						<div>
							<h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
								Dhaka City Blogs
							</h1>
							<p className="text-slate-500">
								Read the latest stories and guides about our city.
							</p>
						</div>

						{/* Search */}
						<form method="GET" action="/blogs" className="flex gap-2">
							{activeCategory !== "all" && (
								<input type="hidden" name="category" value={activeCategory} />
							)}
							<input
								type="text"
								name="search"
								defaultValue={search ?? ""}
								placeholder="Search blogs..."
								className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-56 transition-all"
							/>
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
							>
								Search
							</button>
						</form>
					</div>

					{/* Category tabs */}
					<div className="flex flex-wrap gap-2">
						<Link
							href={buildUrl({ category: undefined, page: "1" })}
							className={cn(
								"px-4 py-1.5 rounded-full text-sm font-semibold border transition-all",
								activeCategory === "all"
									? "bg-blue-600 text-white border-blue-600"
									: "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600",
							)}
						>
							All
						</Link>
						{BLOG_CATEGORIES.map((cat) => (
							<Link
								key={cat}
								href={buildUrl({ category: cat, page: "1" })}
								className={cn(
									"px-4 py-1.5 rounded-full text-sm font-semibold border transition-all",
									activeCategory === cat
										? "bg-blue-600 text-white border-blue-600"
										: "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600",
								)}
							>
								{cat}
							</Link>
						))}
					</div>

					{/* Results count */}
					<p className="text-sm text-slate-500">
						{totalCount === 0
							? "No blogs found"
							: `Showing ${(cp - 1) * pageSize + 1}–${Math.min(cp * pageSize, totalCount)} of ${totalCount} blogs`}
					</p>

					{/* Grid */}
					{items.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{items.map(
								(blog: {
									_id: string;
									slug: string;
									title: string;
									category: string;
									readingMin: number;
									imageUrl: string;
									description: string;
									isAdminPost: boolean;
									createdAt: string;
								}) => (
									<BlogCard
										key={String(blog._id)}
										_id={String(blog._id)}
										slug={blog.slug}
										title={blog.title}
										category={blog.category}
										readingMin={blog.readingMin}
										imageUrl={blog.imageUrl}
										description={blog.description}
										isAdminPost={blog.isAdminPost}
										createdAt={blog.createdAt as unknown as string}
									/>
								),
							)}
						</div>
					) : (
						<div className="py-24 flex flex-col items-center gap-3 text-slate-400">
							<span className="text-5xl">📭</span>
							<p className="text-lg font-medium">No blogs found</p>
							<Link
								href="/blogs"
								className="text-sm text-blue-600 hover:underline"
							>
								Clear filters
							</Link>
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-center items-center gap-2 pt-4">
							{currentPage > 1 && (
								<Link
									href={buildUrl({ page: String(currentPage - 1) })}
									className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all"
								>
									← Previous
								</Link>
							)}

							{Array.from({ length: totalPages }, (_, i) => i + 1)
								.filter(
									(p) =>
										p === 1 ||
										p === totalPages ||
										Math.abs(p - currentPage) <= 1,
								)
								.reduce<(number | "...")[]>((acc, p, i, arr) => {
									if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
									acc.push(p);
									return acc;
								}, [])
								.map((p, i) =>
									p === "..." ? (
										<span key={`ellipsis-${i}`} className="px-2 text-slate-400">
											…
										</span>
									) : (
										<Link
											key={p}
											href={buildUrl({ page: String(p) })}
											className={cn(
												"w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all",
												p === currentPage
													? "bg-blue-600 text-white border-blue-600"
													: "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600",
											)}
										>
											{p}
										</Link>
									),
								)}

							{currentPage < totalPages && (
								<Link
									href={buildUrl({ page: String(currentPage + 1) })}
									className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all"
								>
									Next →
								</Link>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
