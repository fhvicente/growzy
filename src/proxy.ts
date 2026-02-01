import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const defaultLocale = "pt";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Se está na raiz, redireciona para o locale padrão
	if (pathname === "/") {
		return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
	}

	// Verifica autenticação para rotas protegidas
	const sessionCookie = getSessionCookie(request);

	if (!sessionCookie) {
		return NextResponse.redirect(new URL(`/${defaultLocale}/login`, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/",
		"/dashboard",
		"/profile",
		"/calculator/:path*",
		"/admin/:path*",
		"/:locale/dashboard",
		"/:locale/profile",
		"/:locale/calculator/:path*",
		"/:locale/admin/:path*",
	],
};
