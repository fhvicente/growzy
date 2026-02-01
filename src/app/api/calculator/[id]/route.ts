import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { calculations } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const user = await getSessionUser(request);
	const { id: rawId } = await params;
	const id = Number(rawId);
	if (!id) {
		return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
	}

	const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));

	if (!calculation) {
		return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
	}

	if (!calculation.isPublic && (!user || String(user.id) !== calculation.userId)) {
		return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
	}

	return NextResponse.json({ ok: true, calculation });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const { id: rawId } = await params;
	const id = Number(rawId);
	if (!id) {
		return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
	}

	await db.delete(calculations).where(and(eq(calculations.id, id), eq(calculations.userId, String(user.id))));

	return NextResponse.json({ ok: true });
}
