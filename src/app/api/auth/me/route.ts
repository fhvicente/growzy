import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getSessionUser } from "@/lib/session";

// isAdmin vem da sessão no servidor, nunca do cliente. Serve só para o menu:
// quem o falsificar no browser continua a levar 404/403 nas páginas e APIs de admin.
export async function GET(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	return NextResponse.json(
		{ ok: true, id: user.id, email: user.email, isAdmin: isAdmin(user.email) },
		{ headers: { "Cache-Control": "private, no-store" } },
	);
}
