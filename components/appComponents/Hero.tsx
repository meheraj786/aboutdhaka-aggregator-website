"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Typewriter from "typewriter-effect";
import img from "../../public/heroImg.png";

const Hero = () => {
	const router = useRouter();
	const [query, setQuery] = useState("");

	const handleAsk = () => {
		const trimmed = query.trim();
		if (!trimmed) return;
		router.push(`/ai?q=${encodeURIComponent(trimmed)}`);
	};

	return (
		<section
			id="hero"
			className="relative py-30 px-6 flex flex-col items-center text-center min-h-[600px] justify-center overflow-hidden"
		>
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<Image
					src={img}
					alt="Dhaka Cityscape"
					fill
					className="object-cover"
					priority
					referrerPolicy="no-referrer"
				/>
				<div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
			</div>

			<div className="relative z-10 w-full max-w-5xl">
				<h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
					Discover Dhaka<span className="text-blue-600">&apos;</span>s Best
					<span className="text-blue-600">
						<Typewriter
							options={{
								strings: [
									"Places",
									"Hospitals",
									"Restaurants",
									"Malls",
									"Rents",
									"PC Suggester",
									"Services",
									"Events",
									"Doctors",
									"Hotels",
									"Shops",
									"Vets",
									"Teachers",
									"Freelancers",
								],
								autoStart: true,
								loop: true,
							}}
						/>
					</span>
				</h1>

				<p className="text-slate-600 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
					Your comprehensive guide to exploring the city&apos;s hidden gems,
					essential services, and premium lifestyles.
				</p>

				{/* Glowing AI ask input */}
				<div className="w-full max-w-3xl mx-auto relative group isolate">
					{/* Ambient glow — tight ellipse hugging the input, not a circle blob */}
					<div
						className="absolute -inset-1.5 rounded-[2rem] opacity-40 blur-md transition-opacity duration-300 group-focus-within:opacity-70 -z-10"
						style={{
							background:
								"linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6)",
						}}
					/>
					{/* Spinning gradient ring, thin and clipped to the pill shape */}
					<div
						className="absolute -inset-[2px] rounded-[2rem] opacity-80 overflow-hidden group-focus-within:opacity-100 transition-opacity -z-10"
					>
						<div
							className="absolute inset-[-50%] animate-spin-slow"
							style={{
								background:
									"conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6)",
							}}
						/>
					</div>

					<div className="relative z-10 flex items-center bg-white rounded-[2rem] shadow-2xl shadow-blue-500/10">
						<div className="pl-6 pr-2 flex items-center pointer-events-none shrink-0">
							<Sparkles className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
						</div>
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAsk();
								}
							}}
							placeholder="Ask Dhaka AI anything — hospitals, food, routes..."
							className="w-full py-5 md:py-6 pl-2 pr-2 bg-transparent border-none rounded-[2rem] focus:outline-none text-slate-700 text-base md:text-lg font-medium placeholder:text-slate-400"
						/>
						<button
							type="button"
							onClick={handleAsk}
							disabled={!query.trim()}
							className="m-1.5 md:m-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 md:px-8 py-3.5 md:py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
						>
							<span className="hidden sm:inline">Ask AI</span>
							<ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
						</button>
					</div>
				</div>

				<div className="mt-12 flex flex-wrap justify-center gap-8 text-blue-500 font-bold text-sm uppercase tracking-widest">
					<div className="flex items-center gap-2">
						<span className="w-2 h-2 bg-black rounded-full" />
						500+ Hospitals
					</div>
					<div className="flex items-center gap-2">
						<span className="w-2 h-2 bg-emerald-500 rounded-full" />
						1200+ Restaurants
					</div>
					<div className="flex items-center gap-2">
						<span className="w-2 h-2 bg-rose-500 rounded-full" />
						300+ Hotels
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;