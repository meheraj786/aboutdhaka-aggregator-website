import Link from "next/link";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	viewAllText?: string;
	viewAllHref?: string;
	className?: string;
}

export function SectionHeader({
	title,
	subtitle,
	viewAllText,
	viewAllHref,
	className = "",
}: SectionHeaderProps) {
	return (
		<div className={`flex items-end justify-between mb-8 ${className}`}>
			<div>
				<h2 className="text-3xl font-bold text-[#1e293b] leading-tight">
					{title}
				</h2>
				{subtitle && <p className="text-slate-500 mt-1 text-lg">{subtitle}</p>}
			</div>
			{viewAllText && viewAllHref && (
				<Link
					href={viewAllHref}
					className="text-blue-600 font-semibold flex items-center gap-1 hover:underline transition-all"
				>
					{viewAllText}
				</Link>
			)}
		</div>
	);
}
