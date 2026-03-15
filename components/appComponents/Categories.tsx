import {
	BookOpen,
	Cpu,
	Dog,
	Hospital,
	Key,
	MapPin,
	ShoppingBag,
	Utensils,
} from "lucide-react";

const categories = [
	{ icon: MapPin, label: "Places", color: "bg-blue-50 text-blue-500" },
	{ icon: Hospital, label: "Hospitals", color: "bg-blue-50 text-blue-500" },
	{ icon: Utensils, label: "Dine", color: "bg-blue-50 text-blue-500" },
	{ icon: ShoppingBag, label: "Malls", color: "bg-blue-50 text-blue-500" },
	{ icon: Cpu, label: "PC Build", color: "bg-blue-50 text-blue-500" },
	{ icon: Key, label: "Rent", color: "bg-blue-50 text-blue-500" },
	{ icon: Dog, label: "Vets", color: "bg-blue-50 text-blue-500" },
	{ icon: BookOpen, label: "Blogs", color: "bg-blue-50 text-blue-500" },
];

const Categories = () => {
	return (
		<section id="categories" className="py-12 px-6 md:px-12 lg:px-24 bg-white">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-2xl font-bold text-slate-900">
						Quick Categories
					</h2>
					<a
						href="/"
						className="text-blue-600 font-medium hover:underline text-sm"
					>
						View All
					</a>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
					{categories.map((cat) => (
						<div
							key={cat.label}
							className="group flex flex-col items-center p-6 bg-white border border-slate-50 rounded-2xl hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer"
						>
							<div
								className={`p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 ${cat.color}`}
							>
								<cat.icon className="w-6 h-6" />
							</div>
							<span className="text-sm font-semibold text-slate-700">
								{cat.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Categories;
