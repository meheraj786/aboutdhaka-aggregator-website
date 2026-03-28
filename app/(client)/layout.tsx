import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/appComponents/Footer";
import Header from "@/components/appComponents/Header";

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<div className="pt-16">{children}</div>
			<Footer />
			<Analytics />
		</>
	);
}
