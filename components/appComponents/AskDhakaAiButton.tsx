"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AskDhakaAIButton() {
	return (
		<Link
			href="/ai"
			aria-label="Ask Dhaka AI"
			className="group fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8 isolate"
		>
			{/* Soft ambient glow behind the button — tight, not a blob */}
			<span
				className="absolute -inset-1.5 rounded-full opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-80 -z-10"
				style={{
					background:
						"radial-gradient(circle, rgba(59,130,246,0.6), rgba(139,92,246,0.45) 60%, transparent 75%)",
				}}
			/>

			{/* Spinning gradient ring — clipped to a thin sliver around the pill, not a filled blur */}
			<span className="absolute -inset-[2px] rounded-full overflow-hidden -z-10 opacity-90 group-hover:opacity-100 transition-opacity">
				<span
					className="absolute inset-[-50%] block animate-spin-slow"
					style={{
						background:
							"conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6)",
					}}
				/>
			</span>

			{/* Button body */}
			<span
				className="relative z-10 flex items-center gap-2.5 rounded-full bg-slate-900 px-5 py-3.5 text-white shadow-xl shadow-blue-900/30 transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
				style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
			>
				<span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500">
					<Sparkles className="h-3.5 w-3.5 text-white" />
				</span>
				<span className="text-sm font-black tracking-tight whitespace-nowrap">
					Ask Dhaka AI
				</span>
			</span>
		</Link>
	);
}