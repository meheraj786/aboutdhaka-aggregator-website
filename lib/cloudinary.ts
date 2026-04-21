import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLODINARY_CLOUD_NAME) {
	throw new Error("Missing CLODINARY_CLOUD_NAME environment variable");
}
if (!process.env.CLODINARY_API_KEY) {
	throw new Error("Missing CLODINARY_API_KEY environment variable");
}
if (!process.env.CLODINARY_API_SECRET) {
	throw new Error("Missing CLODINARY_API_SECRET environment variable");
}

cloudinary.config({
	cloud_name: process.env.CLODINARY_CLOUD_NAME,
	api_key: process.env.CLODINARY_API_KEY,
	api_secret: process.env.CLODINARY_API_SECRET,
});

export default cloudinary;
