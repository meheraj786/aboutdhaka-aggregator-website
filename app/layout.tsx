import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/QueryProvide";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	preload: true,
	display: "swap",
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	preload: true,
	display: "swap",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1.0,
	themeColor: "#f3f4f6",
};

export const metadata: Metadata = {
	title: "About Dhaka - Ultimate Dhaka City Guide, Directory & Resources",
	description: "Discover Dhaka City's top attractions, restaurants, hospitals, doctors, bus routes, and local travel guides. Your ultimate digital directory and companion to explore Dhaka.",
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	openGraph: {
		title: "About Dhaka - Ultimate Dhaka City Guide, Directory & Resources",
		description: "Discover Dhaka City's top attractions, restaurants, hospitals, doctors, bus routes, and local travel guides. Your ultimate digital directory and companion to explore Dhaka.",
		url: "https://aboutdhaka.vercel.app/",
		siteName: "About Dhaka",
		images: [
			{
				url: "https://aboutdhaka.vercel.app/og.png",
				width: 800,
				height: 600,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "About Dhaka - Ultimate Dhaka City Guide, Directory & Resources",
		description: "Discover Dhaka City's top attractions, restaurants, hospitals, doctors, bus routes, and local travel guides. Your ultimate digital directory and companion to explore Dhaka.",
		images: ["https://aboutdhaka.vercel.app/og.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${poppins.variable} antialiased`}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							"name": "About Dhaka",
							"url": "https://aboutdhaka.vercel.app/",
							"description": "Discover Dhaka City's top attractions, restaurants, hospitals, doctors, bus routes, and local travel guides. Your ultimate digital directory and companion to explore Dhaka.",
							"potentialAction": {
								"@type": "SearchAction",
								"target": "https://aboutdhaka.vercel.app/places?search={search_term_string}",
								"query-input": "required name=search_term_string"
							}
						}),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							"name": "About Dhaka",
							"url": "https://aboutdhaka.vercel.app/",
							"logo": "https://aboutdhaka.vercel.app/logo.png",
							"contactPoint": {
								"@type": "ContactPoint",
								"contactType": "customer support",
								"email": "contact@aboutdhaka.com"
							}
						}),
					}}
				/>
				<Toaster />
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
