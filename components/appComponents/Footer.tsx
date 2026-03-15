import { Compass, Globe, Mail } from "lucide-react";

const Footer = () => {
	return (
		<footer
			id="footer"
			className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 md:px-12 lg:px-24 font-sans"
		>
			<div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
				{/* Brand Section */}
				<div className="space-y-6">
					<div className="flex items-center gap-2">
						<div className="bg-blue-500 p-1.5 rounded-full">
							<Compass className="w-5 h-5 text-white" />
						</div>
						<span className="text-2xl font-bold text-slate-900 tracking-tight">
							AboutDhaka
						</span>
					</div>
					<p className="text-slate-500 leading-relaxed max-w-xs">
						The ultimate directory and explorer for everything Dhaka. From
						street food to five-star services, we help you find what you need in
						the heart of Bangladesh.
					</p>
					<div className="flex gap-4">
						<a
							href="/"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
						>
							<Globe className="w-5 h-5" />
						</a>
						<a
							href="/"
							className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
						>
							<Mail className="w-5 h-5" />
						</a>
					</div>
				</div>

				{/* Explore Section */}
				<div>
					<h3 className="text-lg font-bold text-slate-900 mb-6">Explore</h3>
					<ul className="space-y-4">
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Travel Places
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Restaurants
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Hospitals
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Bus Routes
							</a>
						</li>
					</ul>
				</div>

				{/* Quick Links Section */}
				<div>
					<h3 className="text-lg font-bold text-slate-900 mb-6">Quick Links</h3>
					<ul className="space-y-4">
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								PC Builder
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Rent Services
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Vet Clinics
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Blogs
							</a>
						</li>
					</ul>
				</div>

				{/* Support Section */}
				<div>
					<h3 className="text-lg font-bold text-slate-900 mb-6">Support</h3>
					<ul className="space-y-4">
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Help Center
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Contact Us
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Privacy Policy
							</a>
						</li>
						<li>
							<a
								href="/"
								className="text-slate-500 hover:text-blue-600 transition-colors"
							>
								Terms of Service
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
				<p className="text-slate-400 text-sm">
					© 2024 AboutDhaka. All rights reserved.
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
