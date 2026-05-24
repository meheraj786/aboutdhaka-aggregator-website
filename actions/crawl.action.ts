"use server";

import { chromium } from "playwright";
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
	const validated = crawlSchema.parse({
		url: formData.get("url"),
		selectors: JSON.parse(formData.get("selectors") as string),
	});

	const browser = await chromium.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();

		await page.setExtraHTTPHeaders({
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		});

		await page.goto(validated.url, {
			waitUntil: "networkidle",
			timeout: 60000,
		});

		const products: Product[] = await page.evaluate((sel) => {
			const productsData: Product[] = [];

			const items = document.querySelectorAll(sel.productContainer);

			items.forEach((item) => {
				const product: {
					title: string;
					price?: string;
					originalPrice?: string;
					image?: string;
					link?: string;
					description?: string;
				} = {};

				// Title
				const titleEl = item.querySelector(sel.title);
				product.title = (titleEl as HTMLElement)?.innerText.trim() || "";

				// Price
				if (sel.price) {
					const priceEl = item.querySelector(sel.price);
					product.price = (priceEl as HTMLElement)?.innerText.trim();
				}

				// Original Price
				if (sel.originalPrice) {
					const origEl = item.querySelector(sel.originalPrice);
					product.originalPrice = (origEl as HTMLElement)?.innerText.trim();
				}

				// Image
				if (sel.image) {
					const imgEl = item.querySelector(sel.image);
					product.image =
						(imgEl as HTMLImageElement)?.src ||
						(imgEl as HTMLImageElement)?.getAttribute("data-src") ||
						"";
				}

				// Link
				if (sel.link) {
					const linkEl = item.querySelector(sel.link);
					product.link = (linkEl as HTMLAnchorElement)?.href;
				}

				// Description
				if (sel.description) {
					const descEl = item.querySelector(sel.description);
					product.description = (descEl as HTMLElement)?.innerText
						.trim()
						.replace(/\s+/g, " ")
						.slice(0, 300);
				}

				if (product.title.length > 15) {
					productsData.push(product);
				}
			});

			return productsData;
		}, validated.selectors);

		return {
			success: true,
			products,
			total: products.length,
			url: validated.url,
		};
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "Crawling failed";
		return {
			success: false,
			error: errorMessage,
		};
	} finally {
		await browser.close();
	}
}
