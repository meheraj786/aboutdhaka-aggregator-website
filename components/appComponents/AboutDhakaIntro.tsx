const AboutDhakaIntro = () => {
	return (
		<section className="py-16 px-6 bg-slate-50 border-t border-b border-slate-100 font-sans">
			<div className="max-w-4xl mx-auto">
				<h2 className="text-3xl font-black text-slate-900 mb-6 text-center tracking-tight">
					Explore Dhaka City – The Ultimate Local Directory & Companion
				</h2>
				<p className="text-slate-600 leading-relaxed mb-6 text-center max-w-3xl mx-auto">
					Dhaka, the historic and vibrant capital of Bangladesh, is a bustling metropolis teeming with rich history, exquisite culinary heritage, diverse cultural hubs, and endless energy. Navigating this megacity can be a challenge for residents and tourists alike. Having a reliable digital companion makes all the difference. About Dhaka is engineered to be your comprehensive local directory and city guide, bringing verified, real-time information directly to your fingertips.
				</p>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
						<h3 className="text-lg font-bold text-slate-900 mb-3">All Essential Services in One Place</h3>
						<p className="text-slate-600 text-sm leading-relaxed">
							Our directory covers everything from public transit details to premium healthcare solutions. Search for local bus routes, find nearest transit hubs, lookup the specialized departments of nearby hospitals, or consult direct contacts for verified expert doctors. We also cater to pet lovers with our detailed directory of top veterinary clinics and vets across Dhaka.
						</p>
					</div>
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
						<h3 className="text-lg font-bold text-slate-900 mb-3">Unveil Attractions & Plan Your Day</h3>
						<p className="text-slate-600 text-sm leading-relaxed">
							Uncover the true spirit of Dhaka by visiting historical monuments, pristine parks, and cultural landmarks. Use our guide to explore travel destinations, review high-quality eateries and restaurants, or browse local shopping malls. For those looking for technology advice, our customized PC builder is a helpful interactive tool.
						</p>
					</div>
				</div>

				<p className="text-slate-600 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
					To obtain official regulatory updates, dynamic urban planning schedules, and civic guidelines, we recommend visiting the official portals of the{" "}
					<a
						href="http://www.dhakasouthcity.gov.bd"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline font-semibold"
					>
						Dhaka South City Corporation (DSCC)
					</a>{" "}
					and the{" "}
					<a
						href="http://www.dncc.gov.bd"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline font-semibold"
					>
						Dhaka North City Corporation (DNCC)
					</a>
					. To learn more about the deep-rooted cultural background, historic development, and demographic shifts, please refer to the detailed{" "}
					<a
						href="https://en.wikipedia.org/wiki/Dhaka"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline font-semibold"
					>
						Dhaka Wikipedia Article
					</a>{" "}
					or search through the comprehensive{" "}
					<a
						href="https://bangladesh.gov.bd"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline font-semibold"
					>
						Bangladesh National Portal
					</a>{" "}
					which hosts critical civic services and regional statistics.
				</p>
			</div>
		</section>
	);
};

export default AboutDhakaIntro;
