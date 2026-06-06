import { Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
	_id: string;
	slug?: string;
	title: string;
	category: string;
	readingMin?: number;
	imageUrl?: string;
	description: string;
	isAdminPost?: boolean;
	createdAt?: string;
	className?: string;
}

export default function BlogCard({
	slug,
	_id,
	title,
	category,
	readingMin,
	imageUrl,
	description,
	isAdminPost,
	createdAt,
	className,
}: BlogCardProps) {
	const href = `/blogs/${slug ?? _id}`;

	// strip HTML tags from description for plain text preview
	const plainDescription = description.replace(/<[^>]*>/g, "");

	const formattedDate = createdAt
		? new Date(createdAt).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})
		: null;

	return (
		<Link href={href} className={cn("group block", className)}>
			<article className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
				{/* Cover image */}
				<div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={title}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							unoptimized
						/>
					) : (
						<div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
							<Tag className="h-10 w-10 text-slate-300" />
						</div>
					)}

					{/* Category badge — overlaid on image */}
					<div className="absolute top-3 left-3">
						<Badge className="bg-white/90 text-slate-700 hover:bg-white border-0 shadow-sm text-xs font-semibold backdrop-blur-sm">
							{category}
						</Badge>
					</div>

					{isAdminPost && (
						<div className="absolute top-3 right-3">
							<Badge className="bg-blue-600 text-white border-0 text-xs">
								Official
							</Badge>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex flex-col flex-grow p-5 gap-3">
					{/* Meta row */}
					<div className="flex items-center gap-3 text-xs text-slate-400">
						{readingMin && (
							<span className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								{readingMin} min read
							</span>
						)}
						{formattedDate && (
							<>
								<span>·</span>
								<span>{formattedDate}</span>
							</>
						)}
					</div>

					{/* Title */}
					<h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
						{title}
					</h2>

					{/* Description */}
					<p className="text-sm text-slate-500 line-clamp-3 flex-grow leading-relaxed">
						{plainDescription}
					</p>

					{/* Read more */}
					<span className="text-sm font-semibold text-blue-600 group-hover:underline mt-auto pt-1">
						Read more →
					</span>
				</div>
			</article>
		</Link>
	);
}
