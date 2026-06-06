"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

const crawlSchema = z.object({
	url: z.string().url("Valid URL din"),
	selectors: z.object({
		productContainer: z.string(),
		title: z.string(),
		price: z.string().optional(),
		originalPrice: z.string().optional(),
		image: z.string().optional(),
		link: z.string().optional(),
		description: z.string().optional(),
	}),
});

export type Product = {
	title: string;
	price?: string;
	originalPrice?: string;
	image?: string;
	link?: string;
	description?: string;
};

export async function crawlWebsite(formData: FormData) {
	try {
		const validated = crawlSchema.parse({
			url: formData.get("url"),
			selectors: JSON.parse(formData.get("selectors") as string),
		});

		const { data: html } = await axios.get(validated.url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.9",
			},
			timeout: 30000,
		});

		const $ = cheerio.load(html);
		const products: Product[] = [];
		const sel = validated.selectors;

		$(sel.productContainer).each((_, element) => {
			const item = $(element);
			const product: Product = {
				title: "",
			};

			// Title
			const titleEl = item.find(sel.title);
			product.title = titleEl.text().trim();

			// Price
			if (sel.price) {
				const priceEl = item.find(sel.price);
				product.price = priceEl.text().trim();
			}

			// Original Price
			if (sel.originalPrice) {
				const origEl = item.find(sel.originalPrice);
				product.originalPrice = origEl.text().trim();
			}

			// Image
			if (sel.image) {
				const imgEl = item.find(sel.image);
				let imageUrl = imgEl.attr("src") || imgEl.attr("data-src") || "";

				// Handle relative URLs
				if (imageUrl && !imageUrl.startsWith("http")) {
					const urlObj = new URL(validated.url);
					imageUrl = `${urlObj.origin}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
				}
				product.image = imageUrl;
			}

			// Link
			if (sel.link) {
				const linkEl = item.find(sel.link);
				let productLink = linkEl.attr("href") || "";

				// Handle relative URLs
				if (productLink && !productLink.startsWith("http")) {
					const urlObj = new URL(validated.url);
					productLink = `${urlObj.origin}${productLink.startsWith("/") ? "" : "/"}${productLink}`;
				}
				product.link = productLink;
			}

			// Description
			if (sel.description) {
				const descEl = item.find(sel.description);
				product.description = descEl
					.text()
					.trim()
					.replace(/\s+/g, " ")
					.slice(0, 300);
			}

			if (product.title.length > 5) {
				products.push(product);
			}
		});

		return {
			success: true,
			products,
			total: products.length,
			url: validated.url,
		};
	} catch (error: unknown) {
		console.error("Crawling Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Crawling failed";
		return {
			success: false,
			error: errorMessage,
		};
	}
}
