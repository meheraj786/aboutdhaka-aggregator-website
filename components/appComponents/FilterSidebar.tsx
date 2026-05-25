"use client";

export interface FilterSidebarSection {
	title: string;
	/** true = multi-select checkboxes, false = single-select (radio) */
	multiSelect?: boolean;
	options: { label: string; value: string }[];
	selected: string[];
	onChange: (selected: string[]) => void;
}

export interface FilterSidebarProps {
	sections?: FilterSidebarSection[];
	onClearAll?: () => void;
}

const FilterSidebar = ({ sections, onClearAll }: FilterSidebarProps = {}) => {
	const hasSections = sections && sections.length > 0;

	const toggleCheckbox = (
		section: FilterSidebarSection,
		value: string,
	) => {
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
					{!hasSections && (
						<button
							type="button"
							className="text-blue-600 text-xs font-medium hover:underline"
						>
							Clear All
						</button>
					)}
				</div>

				{hasSections ? (
					sections.map((section, i) => (
						<div key={section.title} className={i < sections.length - 1 ? "mb-8" : ""}>
							<h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
								<span className="w-1 h-4 bg-blue-600 rounded-full" />
								{section.title}
							</h3>
						<div className="space-y-3 max-h-60 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-600/40">
								{section.options.map((opt) => {
									const isChecked = section.selected.includes(opt.value);
									return (
										<label
											key={opt.value}
											className="flex items-center gap-3 cursor-pointer group"
										>
											<input
												type={section.multiSelect === false ? "radio" : "checkbox"}
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
								})}
							</div>
						</div>
					))
				) : (
					<p className="text-sm text-slate-400">No filters available.</p>
				)}
			</div>
		</aside>
	);
};

export default FilterSidebar;
