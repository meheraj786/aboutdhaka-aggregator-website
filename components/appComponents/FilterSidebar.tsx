"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export interface FilterSidebarSection {
	title: string;
	multiSelect?: boolean;
	searchable?: boolean;
	options: ReadonlyArray<{ label: string; value: string }>;
	selected: string[];
	onChange: (selected: string[]) => void;
}

export interface FilterSidebarProps {
	sections?: FilterSidebarSection[];
	onClearAll?: () => void;
}

const FilterSidebar = ({ sections, onClearAll }: FilterSidebarProps = {}) => {
	const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
		{},
	);
	const hasSections = sections && sections.length > 0;

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

	return (
		<aside className="w-64 shrink-0 hidden lg:block">
			<div className="bg-white border border-slate-100 rounded-2xl p-6 sticky top-20">
				<div className="flex justify-between items-center mb-6">
					<h2 className="font-bold text-slate-900">Filters</h2>
					{hasSections && onClearAll && (
						<button
							type="button"
							onClick={onClearAll}
							className="text-blue-600 text-xs font-medium hover:underline"
						>
							Clear All
						</button>
					)}
				</div>

				{hasSections ? (
					sections.map((section, i) => {
						const query = searchQueries[section.title] || "";
						const filteredOptions = section.options.filter((opt) =>
							opt.label.toLowerCase().includes(query.toLowerCase()),
						);

						return (
							<div
								key={section.title}
								className={i < sections.length - 1 ? "mb-8" : ""}
							>
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
											className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
										/>
									</div>
								)}

								<div className="space-y-3 max-h-60 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-600/40">
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
		</aside>
	);
};

export default FilterSidebar;
