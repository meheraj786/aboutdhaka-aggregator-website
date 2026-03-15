import { Hospital as HospitalIcon, Phone, Star } from "lucide-react";
import Image from "next/image";

const hospitals = [
	{
		name: "Evercare Hospital",
		location: "Bashundhara R/A, Dhaka",
		rating: 4.8,
		reviews: "2.4k",
	},
	{
		name: "Square Hospital",
		location: "Panthapath, Dhaka",
		rating: 4.7,
		reviews: "3.1k",
	},
];

const restaurants = [
	{
		name: "Takeout",
		location: "Multiple Locations",
		rating: 4.9,
		reviews: "Dhaka's best burgers",
		image:
			"https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200",
	},
	{
		name: "Sultan's Dine",
		location: "Gulshan & Dhanmondi",
		rating: 4.8,
		reviews: "Kacchi Biryani Experts",
		image:
			"https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=200",
	},
];

const HospitalsAndRestaurants = () => {
	return (
		<section
			id="hospitals-restaurants"
			className="py-20 px-6 md:px-12 lg:px-24 bg-white"
		>
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
				{/* Hospitals Column */}
				<div>
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold text-slate-900">
							Popular Hospitals
						</h2>
						<a
							href="/"
							className="text-blue-600 font-medium hover:underline text-sm"
						>
							See all
						</a>
					</div>
					<div className="space-y-4">
						{hospitals.map((hosp) => (
							<div
								key={hosp.name}
								className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all"
							>
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
										<HospitalIcon className="w-6 h-6" />
									</div>
									<div>
										<h3 className="font-bold text-slate-900">{hosp.name}</h3>
										<p className="text-xs text-slate-400 mb-1">
											{hosp.location}
										</p>
										<div className="flex items-center gap-1 text-xs">
											<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
											<span className="font-bold text-slate-700">
												{hosp.rating}
											</span>
											<span className="text-slate-400">
												({hosp.reviews} reviews)
											</span>
										</div>
									</div>
								</div>
								<button type="button" className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
									<Phone className="w-5 h-5" />
								</button>
							</div>
						))}
					</div>
				</div>

				{/* Restaurants Column */}
				<div>
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold text-slate-900">
							Best Restaurants
						</h2>
						<a
							href="/"
							className="text-blue-600 font-medium hover:underline text-sm"
						>
							See all
						</a>
					</div>
					<div className="space-y-4">
						{restaurants.map((rest) => (
							<div
								key={rest.name}
								className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all"
							>
								<div className="flex items-center gap-4">
									<Image
										src={rest.image}
										alt={rest.name}
                                        width={100}
                                        height={100}
										className="w-16 h-16 rounded-xl object-cover"
										referrerPolicy="no-referrer"
									/>
									<div>
										<h3 className="font-bold text-slate-900">{rest.name}</h3>
										<p className="text-xs text-slate-400 mb-1">
											{rest.location}
										</p>
										<div className="flex items-center gap-1 text-xs">
											<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
											<span className="font-bold text-slate-700">
												{rest.rating}
											</span>
											<span className="text-slate-400">{rest.reviews}</span>
										</div>
									</div>
								</div>
								<button type="button" className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
									Menu
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default HospitalsAndRestaurants;
