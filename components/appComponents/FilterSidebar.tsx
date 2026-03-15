const FilterSidebar = () => {
	return (
		<aside className="w-64 flex-shrink-0 hidden lg:block">
			<div className="bg-white border border-slate-100 rounded-2xl p-6 sticky top-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="font-bold text-slate-900">Filters</h2>
					<button
						type="button"
						className="text-blue-600 text-xs font-medium hover:underline"
					>
						Clear All
					</button>
				</div>

				{/* Area Filter */}
				<div className="mb-8">
					<h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
						<span className="w-1 h-4 bg-blue-600 rounded-full"></span>
						Area
					</h3>
					<div className="space-y-3">
						{["Dhanmondi", "Banani", "Gulshan", "Mirpur", "Old Dhaka"].map(
							(area) => (
								<label
									key={area}
									className="flex items-center gap-3 cursor-pointer group"
								>
									<input
										type="checkbox"
										className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
										{area}
									</span>
								</label>
							),
						)}
					</div>
				</div>

				{/* Category Filter */}
				<div className="mb-8">
					<h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
						<span className="w-1 h-4 bg-blue-600 rounded-full"></span>
						Category
					</h3>
					<div className="space-y-3">
						{["Parks & Nature", "Museums", "Historical Sites", "Malls"].map(
							(cat) => (
								<label
									key={cat}
									className="flex items-center gap-3 cursor-pointer group"
								>
									<input
										type="checkbox"
										className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
										{cat}
									</span>
								</label>
							),
						)}
					</div>
				</div>

				{/* Rating Filter */}
				<div>
					<h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
						<span className="w-1 h-4 bg-blue-600 rounded-full"></span>
						Rating
					</h3>
					<div className="space-y-3">
						{["4.5+ Stars", "4.0+ Stars"].map((rating) => (
							<label
								key={rating}
								className="flex items-center gap-3 cursor-pointer group"
							>
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
								/>
								<span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
									{rating}
								</span>
							</label>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
};

export default FilterSidebar;
