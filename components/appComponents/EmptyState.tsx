import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	subtitle: string;
	hasFilters?: boolean;
	onClearFilters?: () => void;
}

export default function EmptyState({
	icon: Icon,
	title,
	subtitle,
	hasFilters,
	onClearFilters,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-20 px-6 text-center">
			<div className="relative mb-6">
				<div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
					<Icon className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
				</div>
				<div className="absolute inset-0 w-24 h-24 rounded-full bg-blue-100/50 animate-ping animation-duration-[2.5s]" />
			</div>

			<h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
			<p className="text-slate-500 text-sm max-w-xs leading-relaxed">
				{subtitle}
			</p>

			{hasFilters && onClearFilters && (
				<button
					type="button"
					onClick={onClearFilters}
					className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
				>
					Clear Filters
				</button>
			)}
		</div>
	);
}
