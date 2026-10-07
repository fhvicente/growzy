import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { gardenBodySchema } from "@/lib/garden/schema";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

export async function POST(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const parsed = gardenBodySchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
	}

	const features = getPlanFeatures(await getUserPlan(user.id));
	if (features.maxHortas !== -1) {
		// ponytail: contar e inserir não é atómico; dois pedidos simultâneos podem passar o limite por 1. Aceitável aqui.
		const [{ n }] = await db.select({ n: count() }).from(gardens).where(eq(gardens.userId, user.id));
		if (n >= features.maxHortas) {
			return NextResponse.json(
				{
					ok: false,
					code: "PLAN_LIMIT_EXCEEDED",
					error: `O plano ${features.displayName} guarda até ${features.maxHortas} hortas.`,
				},
				{ status: 403 },
			);
		}
	}

	const [row] = await db
		.insert(gardens)
		.values({ userId: user.id, ...parsed.data })
		.returning();
	return NextResponse.json({ ok: true, data: row }, { status: 201 });
}
