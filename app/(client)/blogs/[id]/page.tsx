"use client";

import {
	Bookmark,
	Calendar,
	Clock,
	Mail,
	MessageSquare,
	Share2,
	ThumbsUp,
} from "lucide-react";
import Image from "next/image";

const relatedStories = [
	{
		title: "Architecture of Dhaka: From Mughal to Modern",
		date: "Oct 18, 2024",
		readTime: "5 min read",
		image:
			"https://images.unsplash.com/photo-1586773860418-d3b97998c637?auto=format&fit=crop&q=80&w=200",
	},
	{
		title: "Top 10 Hidden Gem Eateries in Dhaka",
		date: "Oct 12, 2024",
		readTime: "12 min read",
		image:
			"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200",
	},
	{
		title: "A Shopping Guide to the Markets of Dhaka",
		date: "Oct 05, 2024",
		readTime: "7 min read",
		image:
			"https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=200",
	},
];

export default function BlogDetailPage() {
	return (
		<div className="min-h-screen bg-white pb-20">
			{/* Article Header */}
			<div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
				<div className="flex items-center gap-4 mb-8">
					<span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
						Lifestyle
					</span>
					<div className="flex items-center gap-6 text-slate-400 text-xs font-bold">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>Oct 24, 2024</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4" />
							<span>8 min read</span>
						</div>
					</div>
				</div>

				<h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
					Navigating the Charms of Old Dhaka
				</h1>

				<div className="flex items-center justify-between py-8 border-y border-slate-100">
					<div className="flex items-center gap-4">
						<div className="relative w-12 h-12 rounded-full overflow-hidden">
							<Image
								src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100"
								alt="Farhana Ahmed"
								fill
								className="object-cover"
							/>
						</div>
						<div>
							<h4 className="font-bold text-slate-900">Farhana Ahmed</h4>
							<p className="text-slate-400 text-xs">
								Travel Writer & Historian
							</p>
						</div>
					</div>
					<div className="flex gap-4">
						<button
							type="button"
							className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"
						>
							<Share2 className="w-4 h-4" />
						</button>
						<button
							type="button"
							className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"
						>
							<Bookmark className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			{/* Hero Image */}
			<div className="max-w-7xl mx-auto px-6 mb-20">
				<div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200">
					<Image
						src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=1920"
						alt="Old Dhaka"
						fill
						className="object-cover"
						referrerPolicy="no-referrer"
					/>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
				{/* Article Body */}
				<div className="lg:col-span-8 space-y-12">
					<div className="prose prose-slate prose-xl max-w-none text-slate-600 leading-relaxed">
						<p className="text-2xl font-medium text-slate-700 mb-12">
							Stepping into Old Dhaka, or Puran Dhaka, is like entering a living
							museum. The air is thick with the aroma of spices, the cacophony
							of rickshaw bells, and the echoes of a history that spans over
							four hundred years. From the Mughal architecture of Lalbagh Fort
							to the bustling markets of Shankhari Bazar, every corner tells a
							story.
						</p>

						<h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">
							A Walk Through History: Lalbagh Fort
						</h2>
						<p className="mb-12">
							Our journey begins at the iconic Lalbagh Fort, an unfinished
							17th-century Mughal fortress. Walking through its majestic
							gateways, you&apos;re transported to an era of emperors and
							architectural splendor. The tomb of Pari Bibi, with its intricate
							marble work, stands as a testament to the craftsmanship of the
							past.
						</p>

						<div className="relative h-[500px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-slate-100">
							<Image
								src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=1000"
								alt="Rickshaw in Old Dhaka"
								fill
								className="object-cover"
							/>
						</div>
						<p className="text-center text-slate-400 text-sm mb-12 italic">
							The colorful soul of the city: A traditional Rickshaw in Shankhari
							Bazar.
						</p>

						<h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">
							The Culinary Soul: Street Food Safaris
						</h2>
						<p className="mb-8">
							No visit to Old Dhaka is complete without indulging in its
							legendary street food. The narrow lanes are home to some of the
							oldest eateries in the city. From the melt-in-your-mouth Kacchi
							Biryani of Haji&apos;s to the refreshing Beauty Lassi, your taste
							buds are in for a treat.
						</p>

						<ul className="space-y-4 mb-12 list-none p-0">
							{[
								{ title: "Haji Biryani", desc: "A local legend since 1939." },
								{
									title: "Bakorkhani",
									desc: "A traditional spiced flatbread found in every street corner.",
								},
								{
									title: "Beauty Lassi",
									desc: "The ultimate thirst quencher in the humid heat.",
								},
							].map((item) => (
								<li
									key={item.title}
									className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100"
								>
									<div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
									<div>
										<span className="font-black text-slate-900 block">
											{item.title}:
										</span>
										<span className="text-slate-500">{item.desc}</span>
									</div>
								</li>
							))}
						</ul>
					</div>

					{/* Engagement */}
					<div className="flex items-center justify-between py-12 border-y border-slate-100">
						<div className="flex items-center gap-8">
							<button
								type="button"
								className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold"
							>
								<ThumbsUp className="w-5 h-5" />
								<span>2.4k</span>
							</button>
							<button
								type="button"
								className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold"
							>
								<MessageSquare className="w-5 h-5" />
								<span>128</span>
							</button>
						</div>
						<div className="flex gap-3">
							{["Facebook", "Twitter", "Link"].map((platform) => (
								<button
									key={platform}
									type="button"
									className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
								>
									<Share2 className="w-4 h-4" />
								</button>
							))}
						</div>
					</div>

					{/* Author Bio */}
					<div className="bg-slate-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-start">
						<div className="relative w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0">
							<Image
								src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200"
								alt="Author"
								fill
								className="object-cover"
							/>
						</div>
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-2xl font-black text-slate-900">
									Farhana Ahmed
								</h3>
								<button
									type="button"
									className="text-blue-600 font-bold text-sm hover:underline"
								>
									Follow
								</button>
							</div>
							<p className="text-slate-500 leading-relaxed mb-6">
								Farhana is a Dhaka-based travel writer and cultural historian.
								She has spent the last five years documenting the hidden gems of
								Puran Dhaka, focusing on preserving the oral histories of its
								oldest residents.
							</p>
							<button
								type="button"
								className="text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors"
							>
								View all posts
							</button>
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="lg:col-span-4 space-y-12">
					{/* Related Stories */}
					<section>
						<h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
							Related Stories
						</h3>
						<div className="space-y-8">
							{relatedStories.map((story) => (
								<div
									key={story.title}
									className="flex gap-4 group cursor-pointer"
								>
									<div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-slate-100">
										<Image
											src={story.image}
											alt={story.title}
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-500"
										/>
									</div>
									<div className="space-y-2">
										<h4 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
											{story.title}
										</h4>
										<div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											<span>{story.date}</span>
											<div className="w-1 h-1 bg-slate-200 rounded-full" />
											<span>{story.readTime}</span>
										</div>
									</div>
								</div>
							))}
							<button
								type="button"
								className="w-full py-4 rounded-xl border border-slate-100 text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all"
							>
								View All Stories
							</button>
						</div>
					</section>

					{/* Newsletter */}
					<section className="bg-blue-50 rounded-[2.5rem] p-10 border border-blue-100">
						<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-lg shadow-blue-600/10">
							<Mail className="w-6 h-6" />
						</div>
						<h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
							Get the Best of Dhaka
						</h3>
						<p className="text-slate-500 text-sm mb-8 leading-relaxed">
							Join 10,000+ residents getting weekly guides and event updates.
						</p>
						<div className="space-y-4">
							<input
								type="email"
								placeholder="Your email address"
								className="w-full bg-white border border-blue-100 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
							/>
							<button
								type="button"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-blue-600/20"
							>
								Subscribe Now
							</button>
						</div>
					</section>

					{/* Promo Card */}
					<section className="relative h-80 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl shadow-slate-200">
						<Image
							src="https://images.unsplash.com/photo-1586773860418-d3b97998c637?auto=format&fit=crop&q=80&w=600"
							alt="Promo"
							fill
							className="object-cover group-hover:scale-110 transition-transform duration-1000"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
						<div className="absolute bottom-8 left-8 right-8">
							<span className="inline-block bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider mb-4">
								Promo
							</span>
							<h4 className="text-2xl font-black text-white mb-6 leading-tight">
								Book a Private Old Dhaka Heritage Tour
							</h4>
							<button
								type="button"
								className="w-full bg-white text-slate-900 font-black py-3 rounded-xl hover:bg-slate-100 transition-all text-sm"
							>
								Book Now
							</button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
