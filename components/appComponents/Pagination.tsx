"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

	const pages: (number | "...")[] = [1];

	if (current > 3) pages.push("...");

	const start = Math.max(2, current - 1);
	const end = Math.min(total - 1, current + 1);
	for (let i = start; i <= end; i++) pages.push(i);

	if (current < total - 2) pages.push("...");

	pages.push(total);
	return pages;
}

const Pagination = ({
	currentPage = 1,
	totalPages = 1,
	onPageChange = () => {},
}: PaginationProps) => {
	if (totalPages <= 1) return null;

	const pages = getPageNumbers(currentPage, totalPages);

	return (
		<div className="flex items-center justify-center gap-2 mt-12">
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
			>
				<ChevronLeft className="w-5 h-5 text-slate-600" />
			</button>

			{pages.map((p, i) =>
				p === "..." ? (
					<span key={`ellipsis-${i}`} className="text-slate-400 px-2">
						...
					</span>
				) : (
					<button
						key={p}
						type="button"
						onClick={() => onPageChange(p)}
						className={
							p === currentPage
								? "w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm"
								: "w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
						}
					>
						{p}
					</button>
				),
			)}

			<button
				type="button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
			>
				<ChevronRight className="w-5 h-5 text-slate-600" />
			</button>
		</div>
	);
};

export default Pagination;
