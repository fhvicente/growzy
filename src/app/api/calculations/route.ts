import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { calculations } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

export async function GET(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const rows = await db
		.select()
		.from(calculations)
		.where(eq(calculations.userId, String(user.id)))
		.orderBy(desc(calculations.createdAt));

	return NextResponse.json({ ok: true, data: rows });
}
