import { Star } from "lucide-react";
import Image from "next/image";

const FREELANCERS = [
	{
		id: "f1",
		name: "Asif Mahmud",
		role: "Full Stack Developer",
		description:
			"Specializing in React, Node.js and scalable cloud architecture. 5+ years of experience with international clients.",
		rate: 25,
		rating: 4.9,
		image: "https://picsum.photos/seed/asif/200/200",
	},
	{
		id: "f2",
		name: "Tasnim Jahan",
		role: "UI/UX Designer",
		description:
			"Creating beautiful, user-centric interfaces for mobile and web apps. Expert in Figma and design systems.",
		rate: 30,
		rating: 5.0,
		image: "https://picsum.photos/seed/tasnim/200/200",
	},
	{
		id: "f3",
		name: "Imtiaz Kabir",
		role: "Content Strategist",
		description:
			"Helping brands tell their stories through data-driven content marketing and SEO-optimized writing.",
		rate: 20,
		rating: 4.8,
		image: "https://picsum.photos/seed/imtiaz/200/200",
	},
];

export function FreelancersSection() {
	return (
		<section className="bg-[#0a0f1c] py-20 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-end justify-between mb-12">
					<div>
						<h2 className="text-4xl font-bold text-white leading-tight">
							Professional Freelancers
						</h2>
						<p className="text-slate-400 mt-2 text-lg">
							Hire top talent from Dhaka for your next project
						</p>
					</div>
					<Link
						href="/marketplace"
						className="text-blue-400 font-semibold flex items-center gap-1 hover:underline transition-all"
					>
						Explore Marketplace
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{FREELANCERS.map((freelancer) => (
						<div
							key={freelancer.id}
							className="bg-[#161b2b] border border-slate-800 rounded-2xl p-8 flex flex-col"
						>
							<div className="flex items-center gap-4 mb-6">
								<div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
									<Image
										src={freelancer.image}
										alt={freelancer.name}
										fill
										className="object-cover"
										referrerPolicy="no-referrer"
									/>
								</div>
								<div>
									<h3 className="text-xl font-bold text-white">
										{freelancer.name}
									</h3>
									<p className="text-blue-400 text-sm">{freelancer.role}</p>
								</div>
							</div>
							<p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
								{freelancer.description}
							</p>
							<div className="pt-6 border-t border-slate-800 flex items-center justify-between">
								<p className="text-white font-bold">
									Starts at{" "}
									<span className="text-xl">${freelancer.rate}/hr</span>
								</p>
								<div className="flex items-center gap-1">
									<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
									<span className="text-white font-bold">
										{freelancer.rating.toFixed(1)}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

import Link from "next/link";
