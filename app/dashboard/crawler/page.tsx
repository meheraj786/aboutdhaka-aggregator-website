"use client";

import { useMutation } from "@tanstack/react-query";
import { Download, Link as LinkIcon, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import * as XLSX from "xlsx";
import { crawlWebsite, type Product } from "@/actions/crawl.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function WebCrawlerPage() {
	const [url, setUrl] = useState("");
	const [selectors, setSelectors] = useState({
		productContainer: ".p-item",
		title: ".p-item-name a",
		price: ".p-item-price span, .price-new",
		originalPrice: ".price-old",
		image: ".p-item-img img",
		link: ".p-item-name a",
		description: ".short-description",
	});

	const mutation = useMutation({
		mutationFn: async (formData: FormData) => await crawlWebsite(formData),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!url) return;

		const formData = new FormData();
		formData.append("url", url);
		formData.append("selectors", JSON.stringify(selectors));
		mutation.mutate(formData);
	};

	const downloadExcel = () => {
		if (!mutation.data?.products?.length) return;

		const exportData = mutation.data.products.map((product: Product) => ({
			Name: product.title || "N/A",
			Price: product.price || "N/A",
			Original_Price: product.originalPrice || "N/A",
			Description: product.description || "N/A",
			Image_URL: product.image || "",
			Product_Link: product.link || "",
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

		worksheet["!cols"] = [
			{ wch: 60 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 70 },
			{ wch: 50 },
			{ wch: 50 },
		];

		XLSX.writeFile(
			workbook,
			`Crawled_Products_${new Date().toISOString().slice(0, 10)}.xlsx`,
		);
	};

	const clearResults = () => {
		mutation.reset();
	};

	return (
		<div className="container mx-auto py-10">
			<Card className="max-w-6xl mx-auto">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<LinkIcon className="w-6 h-6" /> Dynamic Web Crawler
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<Label>Website URL</Label>
							<Input
								type="url"
								placeholder="https://www.startech.com.bd/lenovo-laptop"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label>Product Container</Label>
								<Input
									value={selectors.productContainer}
									onChange={(e) =>
										setSelectors({
											...selectors,
											productContainer: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label>Title Selector</Label>
								<Input
									value={selectors.title}
									onChange={(e) =>
										setSelectors({ ...selectors, title: e.target.value })
									}
								/>
							</div>
							<div>
								<Label>Price Selector</Label>
								<Input
									value={selectors.price}
									onChange={(e) =>
										setSelectors({ ...selectors, price: e.target.value })
									}
								/>
							</div>
							<div>
								<Label>Original Price Selector</Label>
								<Input
									value={selectors.originalPrice}
									onChange={(e) =>
										setSelectors({
											...selectors,
											originalPrice: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label>Image Selector</Label>
								<Input
									value={selectors.image}
									onChange={(e) =>
										setSelectors({ ...selectors, image: e.target.value })
									}
								/>
							</div>
							<div>
								<Label>Link Selector</Label>
								<Input
									value={selectors.link}
									onChange={(e) =>
										setSelectors({ ...selectors, link: e.target.value })
									}
								/>
							</div>
							<div className="md:col-span-2">
								<Label>Description Selector</Label>
								<Input
									value={selectors.description}
									onChange={(e) =>
										setSelectors({ ...selectors, description: e.target.value })
									}
								/>
							</div>
						</div>

						<Button
							type="submit"
							disabled={mutation.isPending}
							className="w-full"
						>
							{mutation.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{mutation.isPending ? "Crawling..." : "Start Crawling"}
						</Button>
					</form>

					{mutation.data && (
						<div className="mt-10">
							{mutation.data.success ? (
								<>
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-semibold">
											Found {mutation.data.total} Products
										</h3>
										<div className="flex gap-3">
											<Button onClick={downloadExcel} variant="outline">
												<Download className="mr-2 h-4 w-4" />
												Download Excel
											</Button>
											<Button onClick={clearResults} variant="ghost">
												<Trash2 className="mr-2 h-4 w-4" />
												Clear
											</Button>
										</div>
									</div>

									<div className="border rounded-lg overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Image</TableHead>
													<TableHead>Name</TableHead>
													<TableHead>Price</TableHead>
													<TableHead>Original Price</TableHead>
													<TableHead>Description</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{mutation?.data?.products?.map(
													(product: Product, index: number) => (
														<TableRow key={index}>
															<TableCell>
																{product.image ? (
																	<Image
																		width={80}
																		height={80}
																		src={product.image}
																		alt={product.title}
																		className="w-20 h-20 object-contain rounded border"
																	/>
																) : (
																	<div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
																		No Image
																	</div>
																)}
															</TableCell>
															<TableCell className="font-medium max-w-xs">
																{product.title}
															</TableCell>
															<TableCell className="text-green-600 font-bold whitespace-nowrap">
																{product.price || "N/A"}
															</TableCell>
															<TableCell className="text-red-500 line-through whitespace-nowrap">
																{product.originalPrice || "N/A"}
															</TableCell>
															<TableCell className="max-w-md text-sm text-gray-600">
																{product.description || "No description"}
															</TableCell>
														</TableRow>
													),
												)}
											</TableBody>
										</Table>
									</div>
								</>
							) : (
								<p className="text-red-500 font-medium p-4 bg-red-50 rounded-lg">
									Error: {mutation.data.error}
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
