import type { Metadata } from "next";
import { getHospitalById } from "@/actions/hospital.action";

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	try {
		const { data: hos } = await getHospitalById(params.id);
		const data = hos.data;

		const title = `${data.name} | Hospital Details | About Dhaka`;
		const description = data.detail
			? data.detail.substring(0, 160)
			: "Find comprehensive information about hospitals in Dhaka, including services, facilities, and contact details.";
		const image = data.image || "/default-hospital-image.jpg";

		return {
			title,
			description,
			keywords: [
				"hospital",
				"dhaka",
				data.name,
				"healthcare",
				"medical services",
			],
			openGraph: {
				title,
				description,
				type: "website",
				images: [{ url: image, alt: data.name }],
			},
			robots: {
				index: true,
				follow: true,
			},
			alternates: {
				canonical: `https://aboutdhaka.com/hospitals/${params.id}`,
			},
		};
	} catch (_) {
		return {
			title: "Hospital Details | About Dhaka",
			description:
				"Find comprehensive information about hospitals in Dhaka, including services, facilities, and contact details.",
		};
	}
}
