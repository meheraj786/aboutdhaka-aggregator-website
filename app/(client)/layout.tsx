import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/appComponents/Footer";
import Header from "@/components/appComponents/Header";

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

export const metadata: Metadata = {
	title: "About Dhaka",
	description: "Explore the best of Dhaka City.",
	viewport: "width=device-width, initial-scale=1.0",
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	themeColor: "#f3f4f6",
	openGraph: {
		title: "About Dhaka",
		description: "Explore the best of Dhaka City.",
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
		title: "About Dhaka",
		description: "Explore the best of Dhaka City.",
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
				<Header />
				<div className="pt-16">{children}</div>
				<Footer />
			</body>
		</html>
	);
}
