"use client";
import { Compass, Menu, Search, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
	{ name: "Home", href: "/" },
	{ name: "Places", href: "/places" },
	{ name: "Hospitals", href: "/hospitals" },
	{ name: "Restaurants", href: "/resturants" },
	{ name: "Malls", href: "/malls" },
	{ name: "PC Builder", href: "/pc-builder" },
];

export default function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="fixed top-0 z-[9999] w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo Section */}
				<div className="flex items-center gap-2">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
						<Compass size={24} />
					</div>
					<span className="text-xl font-bold tracking-tight text-slate-900">
						AboutDhaka
					</span>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex md:items-center md:gap-8">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Action Icons */}
				<div className="flex items-center gap-4">
					<button
						type="button"
						className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
					>
						<Search size={20} />
					</button>
					<button
						type="button"
						className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
					>
						<User size={20} />
					</button>

					{/* Mobile Menu Toggle */}
					<button
						type="button"
						className="flex rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Navigation Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
					>
						<div className="flex flex-col space-y-1 px-4 py-4">
							{navItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
