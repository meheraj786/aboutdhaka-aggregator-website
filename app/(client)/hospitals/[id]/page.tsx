"use client";

import {
	Activity,
	Heart,
	HospitalIcon,
	Info,
	Loader2,
	MapPin,
	Phone,
	Search,
	Share2,
	Star,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useFetchHospitalById } from "@/hooks/useHospitals";

export default function HospitalDetailPage() {
	const id = useParams().id;
	const { data, isLoading } = useFetchHospitalById(id as string);
	console.log(data, "data");
	if (isLoading)
		return (
			<div className="min-h-screen text-blue-500 flex items-center justify-center bg-slate-50/30 pb-20">
				<Loader2 className="animate-spin" />{" "}
			</div>
		);
	return (
		<div className="min-h-screen bg-slate-50/30 pb-20">
			{/* Hero Section */}
			<div className="relative h-[500px] w-full">
				<Image
					src={data?.data?.image || ""}
					alt={data?.data?.name || ""}
					fill
					className="object-cover"
					referrerPolicy="no-referrer"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

				<div className="absolute top-8 right-8 flex gap-3">
					<button
						type="button"
						className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
					>
						<Share2 className="w-5 h-5" />
					</button>
					<button
						type="button"
						className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
					>
						<Heart className="w-5 h-5" />
					</button>
					<button
						type="button"
						className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
					>
						<div className="w-6 h-6 bg-orange-400 rounded-full" />
					</button>
				</div>

				<div className="absolute bottom-12 left-6 md:left-12 lg:left-24 max-w-4xl">
					<span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase mb-4">
						★ 24/7 Emergency
					</span>
					<h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
						{data?.data?.name}
					</h1>
					<p className="text-blue-50 text-xl flex items-center gap-2">
						<MapPin className="w-5 h-5" />
						{data?.data?.area?.name}
					</p>
				</div>
			</div>

			{/* Quick Action Bar */}
			<div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
				<div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
							<Phone className="w-6 h-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
								Direct Appointment
							</span>
							<span className="text-xl font-black text-slate-900">
								{data?.data?.phone}
							</span>
						</div>
					</div>
					<div className="flex gap-4 w-full md:w-auto">
						<button
							type="button"
							className="flex-grow md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
						>
							Call Now
						</button>
						<button
							type="button"
							className="flex-grow md:flex-none bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold px-10 py-4 rounded-2xl transition-all border border-slate-100"
						>
							Directions
						</button>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
				{/* Left Column */}
				<div className="lg:col-span-8 space-y-16">
					{/* About */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Info className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-bold text-slate-900">
								About Hospital
							</h2>
						</div>
						<div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm leading-relaxed text-slate-600 text-lg">
							{data?.data?.detail}
						</div>
					</section>

					{/* Top Doctors */}
					{/* <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Top Doctors
                </h2>
              </div>
              <button
                type="button"
                className="text-blue-600 font-bold text-sm hover:underline"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.name}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">
                      {doc.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                      {doc.specialty}
                    </p>
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                      Book Appointment <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

					{/* Medical Services */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Activity className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-bold text-slate-900">
								Medical Services
							</h2>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							{data?.data?.services?.map((service: string) => (
								<div
									key={service}
									className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-blue-200 transition-all cursor-pointer"
								>
									<div
										className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform `}
									>
										<HospitalIcon className="w-6 h-6" />
									</div>
									<span className="font-bold text-slate-900 text-sm">
										{service}
									</span>
								</div>
							))}
						</div>
					</section>

					{/* Diagnostic Test Prices */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<Activity className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-bold text-slate-900">
								Diagnostic Test Prices
							</h2>
						</div>
						<div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
							<div className="p-8 border-b border-slate-50">
								<div className="relative max-w-md">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<input
										type="text"
										placeholder="Search for a diagnostic test..."
										className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
									/>
								</div>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full text-left">
									<thead>
										<tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
											<th className="px-8 py-4">Test Name</th>
											{/* <th className="px-8 py-4">Category</th> */}
											<th className="px-8 py-4 text-right">Price (BDT)</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-50">
										{data?.data?.testPrices?.map(
											(test: { name: string; price: string }) => (
												<tr
													key={test?.name}
													className="hover:bg-slate-50/30 transition-colors"
												>
													<td className="px-8 py-5 font-bold text-slate-700 text-sm">
														{test?.name}
													</td>
													{/* <td className="px-8 py-5 text-slate-400 text-sm">
                          {test.category}
                        </td> */}
													<td className="px-8 py-5 text-right font-black text-blue-600 text-sm">
														{test?.price}
													</td>
												</tr>
											),
										)}
									</tbody>
								</table>
							</div>
							<div className="p-6 bg-slate-50/50 flex items-center gap-2 text-[10px] font-medium text-slate-400">
								<Info className="w-3 h-3" />
								Prices are subject to change. Please confirm with the hospital
								before booking.
							</div>
						</div>
					</section>
				</div>

				{/* Right Column */}
				<div className="lg:col-span-4 space-y-12">
					{/* Location */}
					<section>
						<div className="flex items-center gap-3 mb-8">
							<MapPin className="w-6 h-6 text-blue-600" />
							<h2 className="text-2xl font-bold text-slate-900">Location</h2>
						</div>
						<div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
							<div className="relative h-64 bg-slate-100 flex items-center justify-center group cursor-pointer">
								{/* Mock Map */}
								<div className="absolute inset-0 opacity-20">
									<svg className="w-full h-full" viewBox="0 0 400 300">
										<title>Hospital Map</title>
										<path
											d="M0 50 L400 80 M0 150 L400 170 M100 0 L120 300 M300 0 L280 300"
											stroke="currentColor"
											strokeWidth="10"
											fill="none"
										/>
									</svg>
								</div>
								<div className="relative z-10 flex flex-col items-center gap-4">
									<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
										<MapPin className="w-6 h-6" />
									</div>
									<span className="font-bold text-slate-900">
										View on Google Maps
									</span>
								</div>
							</div>
							<div className="p-8">
								<p className="text-slate-500 text-sm leading-relaxed">
									{data?.data?.location}
								</p>
							</div>
						</div>
					</section>

					{/* Reviews */}
					<section>
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-3">
								<Star className="w-6 h-6 text-blue-600" />
								<h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
							</div>
							<div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-lg">
								<Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
								<span className="text-sm font-black text-yellow-700">
									{data?.data?.rating}
								</span>
							</div>
						</div>
						<div className="space-y-6">
							{[
								{
									name: "Rahat Khan",
									time: "2 DAYS AGO",
									text: "Excellent facilities and very professional staff. The cardiac unit is world-class.",
									initial: "RK",
								},
								{
									name: "Maliha Ahmed",
									time: "1 WEEK AGO",
									text: "Very clean hospital and the doctors take time to explain everything clearly. Highly recommended.",
									initial: "MA",
								},
							].map((review) => (
								<div
									key={review.name}
									className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
								>
									<div className="flex justify-between items-start mb-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs">
												{review.initial}
											</div>
											<div>
												<h4 className="font-bold text-slate-900 text-sm">
													{review.name}
												</h4>
												<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
													{review.time}
												</span>
											</div>
										</div>
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400"
												/>
											))}{" "}
										</div>
									</div>
									<p className="text-slate-500 text-sm leading-relaxed italic">
										&quot;{review.text}&quot;
									</p>
								</div>
							))}
							<button
								type="button"
								className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-2xl transition-all border border-slate-100 text-sm"
							>
								Read All Reviews
							</button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
