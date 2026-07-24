import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://aboutdhaka.vercel.app";

	const staticRoutes = [
		{ url: "", priority: 1.0, changeFrequency: "daily" as const },
		{ url: "/places", priority: 0.9, changeFrequency: "weekly" as const },
		{ url: "/restaurants", priority: 0.85, changeFrequency: "weekly" as const },
		{ url: "/hospitals", priority: 0.85, changeFrequency: "weekly" as const },
		{ url: "/doctors", priority: 0.8, changeFrequency: "weekly" as const },
		{ url: "/bus", priority: 0.8, changeFrequency: "weekly" as const },
		{ url: "/blogs", priority: 0.75, changeFrequency: "weekly" as const },
		{ url: "/pc-builder", priority: 0.7, changeFrequency: "monthly" as const },
	];

	return staticRoutes.map((route) => ({
		url: `${baseUrl}${route.url}`,
		lastModified: new Date(),
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}));
}