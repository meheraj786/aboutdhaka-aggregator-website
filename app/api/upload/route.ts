import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const files = formData.getAll("files");

		if (!files || files.length === 0) {
			return NextResponse.json(
				{ error: "No files provided" },
				{ status: 400 },
			);
		}

		const uploadedUrls: string[] = [];

		for (const file of files) {
			if (!(file instanceof File)) {
				continue;
			}

			// Validate file type
			if (!ALLOWED_TYPES.includes(file.type)) {
				return NextResponse.json(
					{
						error: `Invalid file type: ${file.name}. Only JPG, JPEG, PNG, and WEBP are allowed.`,
					},
					{ status: 400 },
				);
			}

			// Validate file size
			if (file.size > MAX_FILE_SIZE) {
				return NextResponse.json(
					{
						error: `File ${file.name} exceeds the 5MB size limit`,
					},
					{ status: 400 },
				);
			}

			// Convert file to buffer
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			// Upload to Cloudinary
			const result = await new Promise((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						folder: "hospital-aggregator/hospitals",
						resource_type: "auto",
					},
					(error, result) => {
						if (error) reject(error);
						else resolve(result);
					},
				);

				uploadStream.end(buffer);
			});

			const uploadResult = result as { secure_url: string };
			uploadedUrls.push(uploadResult.secure_url);
		}

		return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Failed to upload files" },
			{ status: 500 },
		);
	}
}
