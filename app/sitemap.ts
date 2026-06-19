import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://aboutdhaka.vercel.app";

	// Core pages of the About Dhaka platform
	const routes = [
		"",
		"/places",
		"/restaurants",
		"/hospitals",
		"/veterinary-clinics",
		"/doctors",
		"/vets",
		"/bus",
		"/pc-builder",
		"/blogs",
	];

	return routes.map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: route === "" ? 1.0 : 0.8,
	}));
}
