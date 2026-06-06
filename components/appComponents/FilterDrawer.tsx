"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { FilterSidebarSection } from "./FilterSidebar";

interface FilterDrawerProps {
	open: boolean;
	onClose: () => void;
	sections?: FilterSidebarSection[];
	onClearAll?: () => void;
	activeFilterCount?: number;
}

export default function FilterDrawer({
	open,
	onClose,
	sections,
	onClearAll,
	activeFilterCount = 0,
}: FilterDrawerProps) {
	const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
		{},
	);

	useEffect(() => {
		if (open) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const toggleCheckbox = (section: FilterSidebarSection, value: string) => {
		if (section.selected.includes(value)) {
			section.onChange(section.selected.filter((v) => v !== value));
		} else {
			section.onChange([...section.selected, value]);
		}
	};

	const toggleRadio = (section: FilterSidebarSection, value: string) => {
		if (section.selected.includes(value)) {
			section.onChange([]);
		} else {
			section.onChange([value]);
		}
	};

	const hasSections = sections && sections.length > 0;

	return (
		<>
			<div
				className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
					open
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
				aria-hidden="true"
			/>

			<div
				role="dialog"
				aria-modal="true"
				aria-label="Filters"
				className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 shrink-0">
					<div className="flex items-center gap-2">
						<SlidersHorizontal className="w-4 h-4 text-blue-600" />
						<h2 className="font-bold text-slate-900 text-lg">Filters</h2>
						{activeFilterCount > 0 && (
							<span className="bg-blue-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
								{activeFilterCount}
							</span>
						)}
					</div>
					<div className="flex items-center gap-3">
						{hasSections && onClearAll && activeFilterCount > 0 && (
							<button
								type="button"
								onClick={onClearAll}
								className="text-blue-600 text-sm font-medium hover:underline"
							>
								Clear All
							</button>
						)}
						<button
							type="button"
							onClick={onClose}
							className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
						>
							<X className="w-5 h-5 text-slate-600" />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
					{hasSections ? (
						sections.map((section) => {
							const query = searchQueries[section.title] || "";
							const filteredOptions = section.options.filter((opt) =>
								opt.label.toLowerCase().includes(query.toLowerCase()),
							);

							return (
								<div key={section.title}>
									<h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
										<span className="w-1 h-4 bg-blue-600 rounded-full" />
										{section.title}
									</h3>

									{section.searchable && (
										<div className="relative mb-4">
											<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
											<input
												type="text"
												placeholder={`Search ${section.title.toLowerCase()}...`}
												value={query}
												onChange={(e) =>
													setSearchQueries((prev) => ({
														...prev,
														[section.title]: e.target.value,
													}))
												}
												className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
											/>
										</div>
									)}

									<div className="space-y-3 max-h-56 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-600/40">
										{filteredOptions.length > 0 ? (
											filteredOptions.map((opt) => {
												const isChecked = section.selected.includes(opt.value);
												return (
													<label
														key={opt.value}
														className="flex items-center gap-3 cursor-pointer group"
													>
														<input
															type={
																section.multiSelect === false
																	? "radio"
																	: "checkbox"
															}
															checked={isChecked}
															onChange={() =>
																section.multiSelect === false
																	? toggleRadio(section, opt.value)
																	: toggleCheckbox(section, opt.value)
															}
															className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
														/>
														<span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
															{opt.label}
														</span>
													</label>
												);
											})
										) : (
											<p className="text-xs text-slate-400 py-2">
												No matches found
											</p>
										)}
									</div>
								</div>
							);
						})
					) : (
						<p className="text-sm text-slate-400">No filters available.</p>
					)}
				</div>
			</div>
		</>
	);
}
