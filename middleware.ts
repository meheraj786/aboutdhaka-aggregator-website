import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/dashboard")) {
		if (!token) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		try {
			await jwtVerify(token, JWT_SECRET);
			return NextResponse.next();
		} catch (_) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	if (pathname === "/login" && token) {
		try {
			await jwtVerify(token, JWT_SECRET);
			return NextResponse.redirect(new URL("/dashboard", request.url));
		} catch (_) {
			return NextResponse.next();
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/login"],
};
