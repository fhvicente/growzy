import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { webhookLogs } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

export async function GET(request: NextRequest) {
    const user = await getSessionUser(request);
    if (!user) {
        return NextResponse.json(
            { ok: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    if (user.email !== "admin@example.com") {
        return NextResponse.json(
            { ok: false, error: "Forbidden" },
            { status: 403 },
        );
    }

    const rows = await db
        .select()
        .from(webhookLogs)
        .orderBy(desc(webhookLogs.createdAt));
    return NextResponse.json({ ok: true, data: rows });
}
