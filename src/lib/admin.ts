import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

// ponytail: lista em env chega para 2-3 admins; coluna role se a equipa crescer.
export function isAdmin(email?: string | null) {
	if (!email) return false;
	const admins = (process.env.ADMIN_EMAILS ?? "")
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
	return admins.includes(email.toLowerCase());
}

export async function requireAdmin(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) return { res: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }) } as const;
	if (!isAdmin(user.email))
		return { res: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }) } as const;
	return { user: user as { id: string; email: string } } as const;
}

/** Regista uma ação de admin. `details` nunca leva email, nome nem payloads do cliente. */
export const audit = (actorId: string, action: string, targetId: string | null, details?: Record<string, unknown>) =>
	db.insert(auditLogs).values({ actorId, action, targetId, details });
