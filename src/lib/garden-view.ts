import { and, eq } from "drizzle-orm";
import { applyCatalogPrices } from "@/lib/catalog-prices";
import { db } from "@/lib/db";
import { cropBySlug, supplyBySlug } from "@/lib/garden/catalog";
import { lisbonMonth, planGarden } from "@/lib/garden/plan";
import { type PlanView, redactForPlan } from "@/lib/garden/redact";
import type { GardenInput } from "@/lib/garden/types";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";

/** Resultado do motor já filtrado pelo plano do utilizador. */
export async function gardenView(input: GardenInput, userId: string): Promise<{ view: PlanView; month: number }> {
	const month = lisbonMonth();
	const [plan] = await Promise.all([getUserPlan(userId), applyCatalogPrices()]);
	const features = getPlanFeatures(plan);
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
	if (!row) return null;
	// Entradas guardadas com slugs que o catálogo já não tem fariam o PATCH do talão falhar (400).
	const input = {
		...row.input,
		crops: row.input.crops.filter((c) => cropBySlug.has(c.slug)),
		owned: row.input.owned.filter((o) => supplyBySlug.has(o)),
	};
	return { ...row, input };
}
