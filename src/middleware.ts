import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	// Try to get the JWT token from the request
	const sessionToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

	// Redirect to the login page if the token is missing and the route is protected
	if (!sessionToken && request.nextUrl.pathname !== "/") {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
