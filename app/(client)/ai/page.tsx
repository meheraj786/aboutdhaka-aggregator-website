"use client";

import {
	AlertCircle,
	Bot,
	MapPin,
	MessageSquare,
	Navigation,
	RotateCcw,
	Send,
	Sparkles,
	User,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { askDhakaAI } from "@/actions/dhakaAi.action";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ── TYPES ────────────────────────────────────────────────────────────────────

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	intent?: string;
	resultsCount?: number;
	timestamp: Date;
}

const SUGGESTIONS = [
	{ label: "Find hospitals", query: "hospitals in Dhanmondi", icon: "🏥" },
	{ label: "Top cardiologists", query: "find a cardiologist in Dhaka", icon: "👨‍⚕️" },
	{ label: "Biriyani spots", query: "best biriyani in Dhaka", icon: "🍽️" },
	{ label: "Bus routes", query: "bus from Mirpur to Motijheel", icon: "🚌" },
	{ label: "Gaming PC build", query: "mid budget gaming PC build", icon: "💻" },
	{ label: "Places to visit", query: "popular parks in Dhaka", icon: "🕌" },
];

const INTENT_THEMES: Record<
	string,
	{ label: string; bg: string; text: string; border: string }
> = {
	hospital: { label: "Medical", bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
	doctor: { label: "Healthcare", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
	restaurant: { label: "Dining", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
	bus: { label: "Transport", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
	general: { label: "Info", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" },
};

// ── COMPONENTS ──────────────────────────────────────────────────────────────

function TypingIndicator() {
	return (
		<div className="flex items-start gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
			<div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
				<Bot className="w-5 h-5 text-white" />
			</div>
			<div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none px-5 py-4 shadow-sm">
				<div className="flex gap-1">
					<span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
					<span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
					<span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
				</div>
			</div>
		</div>
	);
}

function MessageBubble({ message }: { message: Message }) {
	const isUser = message.role === "user";
	const theme = message.intent ? INTENT_THEMES[message.intent] || INTENT_THEMES.general : null;

	return (
		<div className={cn("flex items-start gap-4 mb-8", isUser && "flex-row-reverse")}>
			<div
				className={cn(
					"w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
					isUser ? "bg-slate-900" : "bg-blue-600 shadow-md shadow-blue-200"
				)}
			>
				{isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
			</div>

			<div className={cn("flex flex-col gap-2 max-w-[85%] md:max-w-[70%]", isUser && "items-end")}>
				<div
					className={cn(
						"rounded-[1.75rem] px-6 py-4 shadow-sm border transition-all",
						isUser
							? "bg-white border-slate-100 text-slate-800 rounded-tr-none"
							: "bg-white border-blue-50 text-slate-800 rounded-tl-none"
					)}
				>
					{!isUser && theme && (
						<div className="flex items-center gap-2 mb-3">
							<span
								className={cn(
									"px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
									theme.bg,
									theme.text,
									theme.border
								)}
							>
								{theme.label}
							</span>
							{!!message.resultsCount && (
								<span className="text-[10px] font-bold text-slate-400">
									• {message.resultsCount} matches
								</span>
							)}
						</div>
					)}

					<div
						className="prose prose-sm max-w-none text-slate-600 leading-relaxed
            font-medium [&_strong]:text-slate-900 [&_strong]:font-black
            [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1"
					>
						<ReactMarkdown>{message.content}</ReactMarkdown>
					</div>
				</div>

				<span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-2">
					{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
				</span>
			</div>
		</div>
	);
}

// ── CITY SKYLINE ────────────────────────────────────────────────────────────

function CitySkyline() {
	// Deterministic building layout so SSR/CSR markup matches.
	const buildings = [
		{ x: 0, w: 70, h: 180, windows: true },
		{ x: 68, w: 40, h: 120, windows: true },
		{ x: 105, w: 55, h: 240, windows: true, antenna: true },
		{ x: 158, w: 45, h: 150, windows: true },
		{ x: 200, w: 65, h: 210, windows: true },
		{ x: 262, w: 38, h: 110, windows: false },
		{ x: 298, w: 58, h: 280, windows: true, antenna: true },
		{ x: 354, w: 48, h: 160, windows: true },
		{ x: 400, w: 70, h: 200, windows: true },
		{ x: 468, w: 42, h: 130, windows: true },
		{ x: 508, w: 60, h: 260, windows: true, antenna: true },
		{ x: 566, w: 50, h: 170, windows: true },
		{ x: 614, w: 64, h: 220, windows: true },
		{ x: 676, w: 40, h: 120, windows: false },
		{ x: 714, w: 56, h: 300, windows: true, antenna: true },
		{ x: 768, w: 46, h: 160, windows: true },
		{ x: 812, w: 68, h: 195, windows: true },
		{ x: 878, w: 42, h: 135, windows: true },
		{ x: 918, w: 58, h: 250, windows: true, antenna: true },
		{ x: 974, w: 50, h: 175, windows: true },
		{ x: 1022, w: 64, h: 215, windows: true },
		{ x: 1084, w: 40, h: 115, windows: false },
		{ x: 1122, w: 58, h: 270, windows: true, antenna: true },
		{ x: 1178, w: 48, h: 155, windows: true },
		{ x: 1224, w: 70, h: 200, windows: true },
		{ x: 1292, w: 44, h: 130, windows: true },
		{ x: 1334, w: 60, h: 240, windows: true, antenna: true },
		{ x: 1392, w: 50, h: 165, windows: true },
		{ x: 1440, w: 64, h: 210, windows: true },
		{ x: 1502, w: 50, h: 140, windows: false },
		{ x: 1550, w: 50, h: 190, windows: true },
	];

	// Pseudo-random but stable window lighting per building, derived from its x.
	const seeded = (n: number) => {
		const v = Math.sin(n * 12.9898) * 43758.5453;
		return v - Math.floor(v);
	};

	return (
		<svg
			className="absolute bottom-0 left-0 right-0 w-full h-[160px] md:h-[200px] pointer-events-none select-none"
			viewBox="0 0 1600 320"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			{/* Back, dimmer skyline layer for depth */}
			<g opacity="0.35" transform="translate(40,40) scale(0.96)">
				{buildings.map((b, i) => (
					<rect
						key={`back-${i}`}
						x={b.x}
						y={320 - b.h * 0.7}
						width={b.w}
						height={b.h * 0.7}
						fill="#0f1740"
					/>
				))}
			</g>

			{/* Front skyline layer */}
			<g>
				{buildings.map((b, i) => {
					const top = 320 - b.h;
					const cols = Math.max(2, Math.floor(b.w / 14));
					const rows = Math.max(3, Math.floor(b.h / 18));
					const winW = 5;
					const winH = 8;
					const gapX = (b.w - cols * winW) / (cols + 1);
					const gapY = (b.h - rows * winH) / (rows + 1);

					return (
						<g key={`front-${i}`}>
							<rect x={b.x} y={top} width={b.w} height={b.h} fill="#111a3d" />
							{b.antenna && (
								<rect
									x={b.x + b.w / 2 - 1.5}
									y={top - 28}
									width={3}
									height={28}
									fill="#111a3d"
								/>
							)}
							{b.windows &&
								Array.from({ length: rows }).map((_, r) =>
									Array.from({ length: cols }).map((__, c) => {
										const wx = b.x + gapX + c * (winW + gapX);
										const wy = top + gapY + r * (winH + gapY);
										const lit = seeded(b.x * 7 + r * 13 + c * 31) > 0.55;
										return (
											<rect
												key={`${i}-${r}-${c}`}
												x={wx}
												y={wy}
												width={winW}
												height={winH}
												fill={lit ? "#7dd3fc" : "#1e2a5c"}
												opacity={lit ? 0.9 : 0.5}
											/>
										);
									})
								)}
						</g>
					);
				})}
			</g>
		</svg>
	);
}

function DhakaAIContent() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "welcome",
			role: "assistant",
			content:
				"**Assalamu Alaikum!** 👋 I'm your Dhaka City Assistant.\n\nI can help you find the best hospitals, specialist doctors, trending restaurants, or even map out bus routes across the city. What are you looking for today?",
			intent: "general",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const searchParams = useSearchParams();
	const autoSentRef = useRef(false);

	const scrollToBottom = useCallback(() => {
		if (scrollRef.current) {
			const scrollContainer = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
			if (scrollContainer) {
				scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
			}
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading, scrollToBottom]);

	const sendMessage = async (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || isLoading) return;

		const userMsg: Message = {
			id: Date.now().toString(),
			role: "user",
			content: trimmed,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setIsLoading(true);

		try {
			const data = await askDhakaAI(
				trimmed,
				messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
			);

			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: data.reply || "I couldn't process that. Please try again.",
					intent: data.intent,
					resultsCount: data.resultsCount,
					timestamp: new Date(),
				},
			]);
		} catch (err) {
			console.error(err);
			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: "Something went wrong reaching the city database. Please try again.",
					intent: "general",
					timestamp: new Date(),
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const q = searchParams.get("q");
		if (q && q.trim() && !autoSentRef.current) {
			autoSentRef.current = true;
			sendMessage(q);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
			{/* ─── HERO ──────────────────────────────────────────────────────────── */}
			<div className="relative h-[48vh] min-h-[380px] max-h-[480px] overflow-hidden">
				<Image
					width={1600}
					height={900}
					src="https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?w=1600&q=85&auto=format&fit=crop"
					alt="Dhaka skyline at dusk"
					className="absolute inset-0 w-full h-full object-cover object-center"
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(135deg, rgba(15,23,64,0.93) 0%, rgba(30,64,175,0.78) 45%, rgba(0,0,0,0.55) 100%)",
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.06]"
					style={{
						backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>
				<div
					className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
					style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
				/>

				{/* Illustrated skyline silhouette */}
				<CitySkyline />

				<div
					className="absolute bottom-0 left-0 right-0 h-24"
					style={{ background: "linear-gradient(to bottom, transparent, #f8f9fb)" }}
				/>

				<div className="relative z-10 h-full flex flex-col justify-center pb-10 px-6 md:px-12 max-w-7xl mx-auto">
					<div
						className="inline-flex items-center gap-2 self-start mb-4 px-4 py-1.5 rounded-full border border-white/25 backdrop-blur-sm text-white text-[11px] font-black uppercase tracking-[0.15em]"
						style={{ background: "rgba(255,255,255,0.10)" }}
					>
						<Sparkles className="w-3.5 h-3.5 text-blue-300" />
						Dhaka Intelligence Layer
					</div>

					<h1
						className="text-4xl md:text-6xl font-black text-white leading-[1.02] tracking-tight mb-4 max-w-3xl"
						style={{ textShadow: "0 4px 48px rgba(0,0,0,0.5)" }}
					>
						Ask the <span className="text-blue-300">City Anything.</span>
					</h1>
					<p className="text-white/60 text-base md:text-lg max-w-lg leading-relaxed">
						Your personal concierge for the bustling capital — hospitals,
						doctors, food, routes, and city data in real-time.
					</p>
				</div>
			</div>

			{/* ── MAIN CHAT INTERFACE ─────────────────────────────────────────────── */}
			<main className="max-w-5xl mx-auto px-4 -mt-10 pb-24 relative z-20">
				<div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-[80vh] min-h-0">
					{/* Header */}
					<div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
								<MessageSquare className="w-5 h-5 text-white" />
							</div>
							<div>
								<h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
									City Concierge
								</h2>
								<div className="flex items-center gap-1.5">
									<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
									<span className="text-[10px] font-bold text-slate-400 uppercase">
										Live database connected
									</span>
								</div>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMessages([messages[0]])}
							className="rounded-xl hover:bg-slate-50 text-slate-400"
						>
							<RotateCcw className="w-4 h-4" />
						</Button>
					</div>

					{/* Chat content */}
					<ScrollArea ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 bg-[#fafbfc]/50">
						{messages.length === 1 && (
							<div className="max-w-2xl mx-auto mb-12 animate-in fade-in zoom-in-95 duration-500">
								<p className="text-center text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">
									Suggested queries
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{SUGGESTIONS.map((s) => (
										<button
											key={s.label}
											type="button"
											onClick={() => sendMessage(s.query)}
											className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
										>
											<span className="text-xl">{s.icon}</span>
											<span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">
												{s.label}
											</span>
										</button>
									))}
								</div>
							</div>
						)}

						<div className="max-w-4xl mx-auto">
							{messages.map((m) => (
								<MessageBubble key={m.id} message={m} />
							))}
							{isLoading && <TypingIndicator />}
						</div>
					</ScrollArea>

					{/* Input area */}
					<div className="p-6 bg-white border-t border-slate-50">
						<div className="max-w-4xl mx-auto relative">
							<div className="relative flex items-end gap-3 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all p-2">
								<Textarea
									ref={textareaRef}
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											sendMessage(input);
										}
									}}
									placeholder="Ask me anything about Dhaka..."
									className="flex-1 min-h-[50px] max-h-[150px] bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400"
								/>
								<Button
									disabled={!input.trim() || isLoading}
									onClick={() => sendMessage(input)}
									className="mb-1 mr-1 h-11 w-11 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 shrink-0 transition-transform active:scale-95"
								>
									<Send className="w-4 h-4 text-white" />
								</Button>
							</div>
							<div className="flex items-center justify-center gap-4 mt-3">
								<p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
									Shift + Enter for newline
								</p>
								<div className="h-1 w-1 rounded-full bg-slate-200" />
								<p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
									Real-time city data
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<div className="max-w-5xl mx-auto px-4 pb-12 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
						<MapPin className="w-4 h-4 text-slate-400" />
					</div>
					<span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
						Dhaka, Bangladesh
					</span>
				</div>
				<div className="flex items-center gap-6">
					<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Terms</span>
					<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Privacy</span>
				</div>
			</div>
		</div>
	);
}

export default function DhakaAIPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 rounded-2xl bg-blue-100 animate-pulse" />
						<p className="text-sm text-slate-400 animate-pulse font-medium">
							Loading Dhaka AI…
						</p>
					</div>
				</div>
			}
		>
			<DhakaAIContent />
		</Suspense>
	);
}