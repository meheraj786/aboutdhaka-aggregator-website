import { Search } from "lucide-react";

// import Image from 'next/image';

const ROUTES = [
	{
		id: "r1",
		name: "Motijheel to Mirpur",
		route: "ROUTE 6A",
		frequency: "every 10 mins",
	},
	{
		id: "r2",
		name: "Sadarghat to Uttara",
		route: "VICTOR CLASSIC",
		frequency: "every 15 mins",
	},
	{
		id: "r3",
		name: "Gulistan to Gazipur",
		route: "BALAKA",
		frequency: "every 12 mins",
	},
	{
		id: "r4",
		name: "Mohammadpur to Airport",
		route: "PROJAPOTI",
		frequency: "every 20 mins",
	},
];

export function CityNavigationSection() {
	return (
		<section className="px-4 py-12">
			<div className="max-w-7xl mx-auto bg-[#2563eb] rounded-[40px] p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
				<div className="flex-1 z-10">
					<h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
						City Navigation Made Easy
					</h2>
					<p className="text-blue-100 text-xl leading-relaxed mb-12 max-w-xl">
						Check bus routes, find terminal locations, and plan your daily
						commute across Dhaka with real-time updates.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 max-w-lg">
						<div className="relative flex-grow">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
							<input
								type="text"
								placeholder="Enter Bus Number (e.g. 6, 7...)"
								className="w-full bg-white/20 border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
							/>
						</div>
						<button
							type="button"
							className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors whitespace-nowrap"
						>
							Search Routes
						</button>
					</div>
				</div>

				<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full z-10">
					{ROUTES.map((route) => (
						<div
							key={route.id}
							className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all cursor-pointer"
						>
							<p className="text-blue-200 text-[10px] font-bold tracking-widest uppercase mb-2">
								{route.route}
							</p>
							<h3 className="text-white font-bold text-lg mb-4">
								{route.name}
							</h3>
							<p className="text-blue-100/70 text-xs">
								Frequency: {route.frequency}
							</p>
						</div>
					))}
				</div>

				{/* Decorative background elements */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/30 rounded-full blur-3xl -ml-32 -mb-32"></div>
			</div>
		</section>
	);
}
