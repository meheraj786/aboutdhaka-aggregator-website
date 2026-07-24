"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number; // নতুন prop
}

function getPageNumbers(
  current: number,
  total: number,
  siblingCount = 1
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  const leftSibling = Math.max(2, current - siblingCount);
  const rightSibling = Math.min(total - 1, current + siblingCount);

  if (current > 3) pages.push("...");

  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  if (total > 1) pages.push(total);

  return pages;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  siblingCount = 1,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-12 flex-wrap">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="text-slate-400 px-1 sm:px-2 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[38px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                ${
                  p === currentPage
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5 text-slate-600" />
      </button>

      {/* Mobile: Current of Total */}
      <div className="sm:hidden text-sm text-slate-500 ml-2">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default Pagination;