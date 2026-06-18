"use client";

import { useFetchRecentBlogs } from "@/hooks/useBlogs";
import { Clock, User, ArrowRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogSkeleton = () => (
	<div className="group bg-white border border-slate-100 rounded-[32px] overflow-hidden animate-pulse">
		<div className="relative aspect-[16/9] w-full bg-slate-200 flex items-center justify-center">
			<ImageIcon className="w-12 h-12 text-slate-300" />
		</div>
		<div className="p-8 space-y-4">
			<div className="h-4 w-24 bg-slate-200 rounded-full" />
			<div className="h-8 w-full bg-slate-200 rounded-xl" />
			<div className="space-y-2">
				<div className="h-4 w-full bg-slate-100 rounded" />
				<div className="h-4 w-2/3 bg-slate-100 rounded" />
			</div>
			<div className="pt-6 border-t border-slate-50 flex justify-between">
				<div className="h-5 w-24 bg-slate-100 rounded" />
				<div className="h-5 w-16 bg-slate-100 rounded" />
			</div>
		</div>
	</div>
);

export function BlogsSection() {
	const { data: blogs, isLoading } = useFetchRecentBlogs();

	return (
		<section className="py-20 px-6 max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
				<div className="max-w-2xl">
					<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
						</span>
						Latest Stories
					</div>
					<h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
						Insights & <span className="text-blue-600">Stories</span>
					</h2>
					<p className="text-slate-500 mt-4 text-lg leading-relaxed">
						Curated insights into life, food, and culture in the heart of Bangladesh.
					</p>
				</div>
				<Link
					href="/blogs"
					className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
				>
					View All Blogs <ArrowRight className="w-5 h-5" />
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{isLoading
					? Array.from({ length: 4 }).map((_, i) => <BlogSkeleton key={i} />)
					: blogs?.map((blog: any) => (
							<Link href={`/blogs/${blog._id}`} key={blog._id} className="group">
								<div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-500">
									<div className="relative aspect-[16/9] w-full overflow-hidden">
										<Image
											src={blog.imageUrl || "/blog-placeholder.jpg"}
											alt={blog.title}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute top-6 left-6">
											<span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black rounded-xl tracking-widest uppercase shadow-sm">
												{blog.category}
											</span>
										</div>
									</div>
									<div className="p-8 md:p-10">
										<h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
											{blog.title}
										</h3>
										<p className="text-slate-500 text-base leading-relaxed mb-8 line-clamp-2">
											{blog.description?.replace(/<[^>]*>/g, "")}
										</p>
										
										<div className="flex items-center justify-between pt-6 border-t border-slate-100">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
													<User className="w-5 h-5" />
												</div>
												<div className="flex flex-col">
													<span className="text-xs font-black text-slate-900 uppercase">
														{blog.isAdminPost ? "Admin" : "Author"}
													</span>
													<span className="text-[10px] text-slate-400 font-bold">
														{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1.5 text-slate-400 font-bold">
												<Clock className="w-4 h-4" />
												<span className="text-[11px] uppercase tracking-tighter">{blog.readingMin} min read</span>
											</div>
										</div>
									</div>
								</div>
							</Link>
					  ))}
			</div>

			<div className="text-center mt-16 md:hidden">
				<Link
					href="/blogs"
					className="inline-flex items-center gap-2 px-8 py-4 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95"
				>
					See All Stories <ArrowRight className="w-5 h-5" />
				</Link>
			</div>
		</section>
	);
}