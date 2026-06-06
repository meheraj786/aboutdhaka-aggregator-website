"use client";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const navItems = [
	{ name: "HOME", href: "/" },
	{ name: "PLACES", href: "/places" },

	{ name: "RESTAURANTS", href: "/restaurants" },
	{ name: "HOSPITALS", href: "/hospitals" },
	{ name: "VETERINARY CLINICS", href: "/veterinary-clinics" },
		{ name: "DOCTORS", href: "/doctors" },
		{ name: "VETS", href: "/vets" },
		{ name: "BUS ROUTES", href: "/bus" },
		

	{ name: "PC SUGGESTER", href: "/pc-builder" },
];

export default function Header() {
	const path = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="fixed top-0 z-[9999] w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo Section */}
				<Logo />

				{/* Desktop Navigation */}
				<nav className="hidden md:flex md:items-end md:gap-8">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={
								path === item.href
									? "text-sm text-blue-600 font-bold transition-colors hover:text-blue-600"
									: "text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
							}
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Action Icons */}
				<div className="flex md:hidden items-center gap-4">
					{/* <button
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
					</button> */}

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
