import { Search } from "lucide-react";

const Hero = () => {
	return (
		<section
			id="hero"
			className="py-20 px-6 bg-white flex flex-col items-center text-center"
		>
			<h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
				Discover the Best of <span className="text-blue-600">Dhaka</span>
			</h1>
			<p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
				Your comprehensive guide to exploring the city's hidden gems, essential
				services, and premium lifestyles.
			</p>

			<div className="w-full max-w-3xl relative group">
				<div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
					<Search className="h-5 w-5 text-slate-400" />
				</div>
				<input
					type="text"
					placeholder="Search places, hospitals, restaurants in Dhaka..."
					className="w-full py-5 pl-14 pr-32 bg-white border border-slate-100 rounded-2xl shadow-sm shadow-[#1392EC]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
				/>
				<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold transition-colors">
					Search
				</button>
			</div>
		</section>
	);
};

export default Hero;
