import { desc } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { webhookLogs } from "@/lib/schema";

export async function GET(request: NextRequest) {
	const { res } = await requireAdmin(request);
	if (res) return res;

	const rows = await db.select().from(webhookLogs).orderBy(desc(webhookLogs.createdAt));
	return NextResponse.json({ ok: true, data: rows });
}
