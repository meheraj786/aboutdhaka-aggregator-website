"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
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
	const [isOpen, setIsOpen] = useState(false);
	const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
		{},
	);
	const hasSections = sections && sections.length > 0;

	const activeFilterCount = sections?.reduce(
		(acc, sec) => acc + (sec.selected?.length || 0),
		0,
	) || 0;

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

	const renderFilterContent = () => (
		<>
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<h2 className="font-bold text-slate-900">Filters</h2>
					{activeFilterCount > 0 && (
						<span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
							{activeFilterCount}
						</span>
					)}
				</div>
				{hasSections && onClearAll && (
					<button
						type="button"
						onClick={onClearAll}
						className="text-blue-600 text-xs font-medium hover:underline cursor-pointer"
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
													className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
												/>
												<span
													className={`text-sm transition-colors ${
														isChecked
															? "text-blue-600 font-semibold"
															: "text-slate-600 group-hover:text-slate-900"
													}`}
												>
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
		</>
	);

	return (
		<>
			<div className="lg:hidden flex items-center mb-4">
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 hover:border-slate-300 rounded-lg bg-white text-slate-700 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
				>
					<SlidersHorizontal className="w-4 h-4 text-slate-500 stroke-[1.8]" />
					<span>Filters</span>
					{activeFilterCount > 0 && (
						<span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
							{activeFilterCount}
						</span>
					)}
				</button>
			</div>

			<div
				className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
					isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
			>
				<button
					type="button"
					aria-label="Close filters"
					className="absolute inset-0 w-full h-full bg-slate-900/40 backdrop-blur-sm cursor-default border-none outline-none"
					onClick={() => setIsOpen(false)}
				/>

				<div
					className={`absolute inset-y-0 left-0 w-80 max-w-[calc(100vw-3rem)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
						isOpen ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					<div className="flex items-center justify-between border-b border-slate-100 p-4 shrink-0">
						<div className="flex items-center gap-2">
							<span className="font-bold text-slate-900">Filters</span>
							{activeFilterCount > 0 && (
								<span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
									{activeFilterCount}
								</span>
							)}
						</div>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6">
						{renderFilterContent()}
					</div>
				</div>
			</div>

			<aside className="hidden lg:block w-64 shrink-0">
				<div className="bg-white border border-slate-100 rounded-2xl p-6 sticky top-20">
					{renderFilterContent()}
				</div>
			</aside>
		</>
	);
};

export default FilterSidebar;