import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = () => {
	return (
		<div className="flex items-center justify-center gap-2 mt-12">
			<button
				type="button"
				className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
			>
				<ChevronLeft className="w-5 h-5 text-slate-600" />
			</button>

			<button
				type="button"
				className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm"
			>
				1
			</button>
			<button
				type="button"
				className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
			>
				2
			</button>
			<button
				type="button"
				className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
			>
				3
			</button>

			<span className="text-slate-400 px-2">...</span>

			<button
				type="button"
				className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
			>
				10
			</button>

			<button
				type="button"
				className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
			>
				<ChevronRight className="w-5 h-5 text-slate-600" />
			</button>
		</div>
	);
};

export default Pagination;
