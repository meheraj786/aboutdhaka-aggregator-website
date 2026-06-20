
import { FaFacebook as Facebook, FaInstagram as Instagram, FaLinkedin as Linkedin, FaTwitter as Twitter, FaYoutube as Youtube } from "react-icons/fa";
import Link from "next/link";
import Logo from "./Logo";
import { Mail } from "lucide-react";

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer
			id="footer"
			className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 md:px-12 lg:px-24 font-sans"
		>
			<div className="max-w-7xl mx-auto text-center grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
				{/* Brand Section */}
				<div className="space-y-6">
					<Logo />
					<p className="text-slate-500 text-left leading-relaxed ">
						The ultimate directory and explorer for everything Dhaka. From
						street food to five-star services, we help you find what you need in
						the heart of Bangladesh.
					</p>
					<div className="flex flex-wrap gap-3">
						<Link
							href="https://facebook.com/aboutdhaka"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Follow us on Facebook"
							title="Facebook"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
						>
							<Facebook className="w-5 h-5" />
							<span className="sr-only">Facebook</span>
						</Link>
						<Link
							href="https://twitter.com/aboutdhaka"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Follow us on X (Twitter)"
							title="X (Twitter)"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all"
						>
							<Twitter className="w-5 h-5" />
							<span className="sr-only">X (Twitter)</span>
						</Link>
						<Link
							href="https://instagram.com/aboutdhaka"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Follow us on Instagram"
							title="Instagram"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-rose-600 hover:text-white transition-all"
						>
							<Instagram className="w-5 h-5" />
							<span className="sr-only">Instagram</span>
						</Link>
						<Link
							href="https://linkedin.com/company/aboutdhaka"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Follow us on LinkedIn"
							title="LinkedIn"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-700 hover:text-white transition-all"
						>
							<Linkedin className="w-5 h-5" />
							<span className="sr-only">LinkedIn</span>
						</Link>
						<Link
							href="https://youtube.com/@aboutdhaka"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Subscribe to our YouTube channel"
							title="YouTube"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all"
						>
							<Youtube className="w-5 h-5" />
							<span className="sr-only">YouTube</span>
						</Link>
						<Link
							href="mailto:contact@aboutdhaka.com"
							aria-label="Email Us"
							title="Email Us"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
						>
							<Mail className="w-5 h-5" />
							<span className="sr-only">Email Us</span>
						</Link>
					</div>
				</div>

				{/* Explore Section */}
				<div>
					<h3 className="text-lg font-bold text-slate-900 mb-6">Explore</h3>
					<ul className="space-y-4">
						<li>
							<Link
								href="/places"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Travel Places
							</Link>
						</li>
						<li>
							<Link
								href="/restaurants"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Restaurants
							</Link>
						</li>
						<li>
							<Link
								href="/hospitals"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Hospitals
							</Link>
						</li>
						<li>
							<Link
								href="/bus"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Bus Routes
							</Link>
						</li>
					</ul>
				</div>

				{/* Quick Links Section */}
				<div>
					<h3 className="text-lg font-bold text-slate-900 mb-6">Quick Links</h3>
					<ul className="space-y-4">
						<li>
							<Link
								href="/pc-builder"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								PC Suggester
							</Link>
						</li>
						<li>
							<Link
								href="/rent"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Rent Services
							</Link>
						</li>
						<li>
							<Link
								href="/vets"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Vet Clinics
							</Link>
						</li>
						<li>
							<Link
								href="/blogs"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Blogs
							</Link>
						</li>
					</ul>
				</div>

				{/* Support Section */}
				<div>
					<h3 className="text-lg font-bold text-slate-900 mb-6">Support</h3>
					<ul className="space-y-4">
						<li>
							<Link
								href="/help-center"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Help Center
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Contact Us
							</Link>
						</li>
						<li>
							<Link
								href="/privacy-policy"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link
								href="/terms-of-service"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Terms of Service
							</Link>
						</li>
					</ul>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
				<p className="text-slate-400 text-sm">
					© {year} AboutDhaka. All rights reserved.
				</p>
				<div className="flex items-center gap-8 text-sm text-slate-400">
					<div className="flex items-center gap-1">
						<span>Language:</span>
						<span className="text-slate-500">English (US)</span>
					</div>
					<div className="flex items-center gap-1">
						<span>Region:</span>
						<span className="text-slate-500">Bangladesh</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
