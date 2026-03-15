import { ArrowRight } from "lucide-react";
import Image from "next/image";

const places = [
	{
		title: "Lalbagh Fort",
		category: "HISTORIC",
		description:
			"A 17th-century Mughal fort complex that stands as a symbol of Dhaka's rich heritage.",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg/1280px-%E0%A6%B2%E0%A6%BE%E0%A6%B2_%E0%A6%95%E0%A7%87%E0%A6%B2%E0%A7%8D%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%AE%E0%A6%BE%E0%A6%AF%E0%A6%BC%E0%A6%BE.jpg",
		tagColor: "bg-blue-50 text-blue-500",
	},
	{
		title: "Ahsan Manzil",
		category: "CULTURAL",
		description:
			"The Pink Palace, formerly the official residential palace of the Nawab of Dhaka.",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/3/31/%E0%A6%86%E0%A6%B9%E0%A6%B8%E0%A6%BE%E0%A6%A8%E0%A6%AE%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A6%BF%E0%A6%B2%E0%A6%A2%E0%A6%BE%E0%A6%95%E0%A6%BE.jpg",
		tagColor: "bg-blue-50 text-blue-500",
	},
	{
		title: "Parliament House",
		category: "MODERN",
		description:
			"An architectural masterpiece designed by Louis Kahn, representing modern Bangladesh.",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/National_Assembly_of_Bangladesh_%2810%29.jpg/1280px-National_Assembly_of_Bangladesh_%2810%29.jpg",
		tagColor: "bg-blue-50 text-blue-500",
	},
];

const TravelPlaces = () => {
	return (
		<section
			id="travel-places"
			className="py-16 px-6 md:px-12 lg:px-24 bg-slate-50/50"
		>
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-end mb-10">
					<div>
						<h2 className="text-3xl font-bold text-slate-900 mb-2">
							Top Travel Places
						</h2>
						<p className="text-slate-500">
							Must-visit historical and cultural landmarks
						</p>
					</div>
					<a
						href="/"
						className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
					>
						See more <ArrowRight className="w-5 h-5" />
					</a>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{places.map((place) => (
						<div
							key={place.title}
							className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
						>
							<div className="relative h-64 overflow-hidden">
								<Image
									src={place.image}
									alt={place.title}
									width={100}
									height={100}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									referrerPolicy="no-referrer"
								/>
							</div>
							<div className="p-8">
								<span
									className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider mb-4 ${place.tagColor}`}
								>
									{place.category}
								</span>
								<h3 className="text-xl font-bold text-slate-900 mb-3">
									{place.title}
								</h3>
								<p className="text-slate-500 text-sm leading-relaxed">
									{place.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TravelPlaces;
