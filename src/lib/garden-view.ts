import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lisbonMonth, planGarden } from "@/lib/garden/plan";
import { type PlanView, redactForPlan } from "@/lib/garden/redact";
import type { GardenInput } from "@/lib/garden/types";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";

/** Resultado do motor já filtrado pelo plano do utilizador. */
export async function gardenView(input: GardenInput, userId: string): Promise<{ view: PlanView; month: number }> {
	const month = lisbonMonth();
	const features = getPlanFeatures(await getUserPlan(userId));
	return { view: redactForPlan(planGarden(input, month), features, month), month };
}

/** Horta do utilizador, ou null (id inválido ou de outra pessoa). */
export async function getUserGarden(rawId: string, userId: string) {
	const id = Number(rawId);
	if (!Number.isInteger(id) || id <= 0) return null;
	const [row] = await db
		.select()
		.from(gardens)
		.where(and(eq(gardens.id, id), eq(gardens.userId, userId)));
	return row ?? null;
}
