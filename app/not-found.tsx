"use client";

import { Home } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
	return (
		<main
			className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white"
			style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
		>
			{/* Ambient glow blobs */}
			<div
				aria-hidden="true"
				className="absolute top-[-15%] left-[-8%] w-[550px] h-[550px] rounded-full bg-blue-100 blur-[130px] animate-blob"
			/>
			<div
				aria-hidden="true"
				className="absolute bottom-[-15%] right-[-8%] w-[480px] h-[480px] rounded-full bg-blue-200/60 blur-[110px] animate-blob animation-delay-2000"
			/>
			<div
				aria-hidden="true"
				className="absolute top-[35%] left-[55%] w-[280px] h-[280px] rounded-full bg-blue-100/80 blur-[80px] animate-blob animation-delay-4000"
			/>

			{/* Subtle grid */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-[0.022]"
				style={{
					backgroundImage:
						"linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center text-center px-6 gap-10">
				{/* Status badge */}
				<div
					className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-semibold tracking-widest uppercase shadow-sm animate-slide-down"
					style={{ animationDelay: "0ms" }}
				>
					<span
						aria-hidden="true"
						className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping-slow"
					/>
					Launching Soon
				</div>

				{/* Headline */}
				<div className="animate-slide-down" style={{ animationDelay: "80ms" }}>
					<h1
						className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight"
						style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
					>
						<span className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
							Something
						</span>
						<br />
						<span className="relative inline-block">
							<span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 bg-clip-text text-transparent">
								Incredible
							</span>
							{/* Decorative wavy underline — hidden from screen readers */}
							<svg
								aria-hidden="true"
								focusable="false"
								className="absolute -bottom-2 left-0 w-full"
								viewBox="0 0 300 8"
								fill="none"
								preserveAspectRatio="none"
							>
								<path
									d="M0 6 Q75 0 150 5 Q225 10 300 4"
									stroke="url(#wavy-grad)"
									strokeWidth="2.5"
									strokeLinecap="round"
								/>
								<defs>
									<linearGradient
										id="wavy-grad"
										x1="0"
										y1="0"
										x2="300"
										y2="0"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#3b82f6" />
										<stop offset="1" stopColor="#1d4ed8" />
									</linearGradient>
								</defs>
							</svg>
						</span>
						<br />
						<span className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
							Is Coming
						</span>
					</h1>
				</div>

				{/* Subtitle */}
				<p
					className="text-slate-500 text-base sm:text-lg max-w-lg leading-relaxed animate-slide-down"
					style={{ animationDelay: "160ms" }}
				>
					We&apos;re crafting something extraordinary. Be the first to
					experience it when we go live.
				</p>
			</div>
			<div className="text-center">
				<Link
					href="/"
					className="text-blue-600 font-semibold gap-1 hover:underline transition-all mt-7 flex justify-center items-center"
				>
					<Home className="w-5 h-5" /> Go Back
				</Link>
			</div>

			<style jsx global>{`

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(35px, -25px) scale(1.07); }
          66%       { transform: translate(-18px, 18px) scale(0.96); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ping-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(1.9); }
        }

        .animate-blob           { animation: blob 11s ease-in-out infinite; }
        .animation-delay-2000   { animation-delay: 2s; }
        .animation-delay-4000   { animation-delay: 4s; }
        .animate-slide-down     { animation: slide-down 0.65s cubic-bezier(.22,1,.36,1) both; }
        .animate-fade-in        { animation: fade-in 0.5s ease both; }
        .animate-ping-slow      { animation: ping-slow 2s ease-in-out infinite; }
      `}</style>
		</main>
	);
}
