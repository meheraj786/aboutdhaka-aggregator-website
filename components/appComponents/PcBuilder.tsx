export function PCBuilderSection() {
	return (
		<section className="px-4 py-12">
			<div className="max-w-7xl mx-auto bg-[#0a1128] rounded-[40px] p-12 md:p-24 overflow-hidden relative">
				<div className="z-10 relative max-w-2xl">
					<p className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-6">
						TECH SERVICES
					</p>
					<h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
						Build Your Dream PC in Minutes
					</h2>
					<p className="text-slate-400 text-xl leading-relaxed mb-12">
						Our expert-led PC building service helps you choose the perfect
						components for gaming, work, or creative projects.
					</p>

					<div className="flex flex-wrap gap-4">
						<button
							type="button"
							className="bg-blue-600 text-white font-bold px-10 py-5 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
						>
							Start Building
						</button>
						<button
							type="button"
							className="bg-slate-800 text-white font-bold px-10 py-5 rounded-2xl hover:bg-slate-700 transition-colors"
						>
							Talk to Expert
						</button>
					</div>
				</div>

				{/* Abstract background glow */}
				<div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
				<div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px]"></div>
			</div>
		</section>
	);
}
