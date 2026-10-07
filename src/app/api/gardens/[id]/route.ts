import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { gardenView, getUserGarden } from "@/lib/garden-view";
import { gardenBodySchema } from "@/lib/garden/schema";
import { gardens } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

const unauthorized = () => NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
const notFound = () => NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

export async function GET(request: NextRequest, { params }: Ctx) {
	const user = await getSessionUser(request);
	if (!user) return unauthorized();
	const garden = await getUserGarden((await params).id, user.id);
	if (!garden) return notFound();
	return NextResponse.json({ ok: true, data: { garden, ...(await gardenView(garden.input, user.id)) } });
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
	const user = await getSessionUser(request);
	if (!user) return unauthorized();
	const parsed = gardenBodySchema.partial().safeParse(await request.json().catch(() => null));
	if (!parsed.success || Object.keys(parsed.data).length === 0) {
		return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
	}
	const garden = await getUserGarden((await params).id, user.id);
	if (!garden) return notFound();
	const [row] = await db.update(gardens).set(parsed.data).where(eq(gardens.id, garden.id)).returning();
	return NextResponse.json({ ok: true, data: row });
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
	const user = await getSessionUser(request);
	if (!user) return unauthorized();
	const garden = await getUserGarden((await params).id, user.id);
	if (!garden) return notFound();
	await db.delete(gardens).where(eq(gardens.id, garden.id));
	return NextResponse.json({ ok: true });
}
