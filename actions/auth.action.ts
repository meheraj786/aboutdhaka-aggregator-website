"use server";

import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/user.model";
import { loginSchema } from "@/validators/auth";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export async function seedAdmin() {
	await dbConnect();
	const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

	if (existingAdmin) return { message: "Admin already exists" };
	const password = process.env.ADMIN_PASSWORD;

	const hashedPassword = await bcrypt.hash(password as string, 12);
	await User.create({
		email: process.env.ADMIN_EMAIL,
		password: hashedPassword,
		name: "Admin",
	});

	return {
		message: "Admin created successfully! Use admin@dhaka.com / admin123456",
	};
}

export async function login(payload: unknown) {
	try {
		const validated = loginSchema.parse(payload);
		await dbConnect();

		const user = await User.findOne({ email: validated.email });
		if (!user) throw new Error("Invalid credentials");

		const isMatch = await bcrypt.compare(validated.password, user.password);
		if (!isMatch) throw new Error("Invalid credentials");

		const token = await new SignJWT({ userId: user._id, email: user.email })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1d")
			.sign(JWT_SECRET);

		const cookieStore = await cookies();
		cookieStore.set("auth_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24, // 1 day
		});

		return { success: true };
	} catch (error) {
		return { success: false, error: error };
	}
}

export async function logout() {
	const cookieStore = await cookies();

	cookieStore.delete("auth_token");
	redirect("/login");
}
