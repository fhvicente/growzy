import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function getSessionUser(request: NextRequest) {
	return (await auth.api.getSession({ headers: request.headers }))?.user ?? null;
}
