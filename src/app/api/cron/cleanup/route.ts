import { lt } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions, verifications, webhookLogs } from "@/lib/schema";

// RGPD Art. 5(1)(e). Corre todos os dias (vercel.json); a Vercel envia `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: NextRequest) {
	const secret = process.env.CRON_SECRET;
	if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const now = new Date();
	const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
	const [s, v, w] = await Promise.all([
		db.delete(sessions).where(lt(sessions.expiresAt, now)).returning({ id: sessions.id }),
		db.delete(verifications).where(lt(verifications.expiresAt, now)).returning({ id: verifications.id }),
		db.delete(webhookLogs).where(lt(webhookLogs.createdAt, ninetyDaysAgo)).returning({ id: webhookLogs.id }),
	]);
	return NextResponse.json({
		ok: true,
		deleted: { sessions: s.length, verifications: v.length, webhookLogs: w.length },
	});
}
