import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getPlanFeatures, type PlanType } from "@/lib/plans";
import { getSessionUser } from "@/lib/session";

export type PlanLimitError = {
	ok: false;
	error: string;
	code: "PLAN_LIMIT_EXCEEDED" | "FEATURE_NOT_AVAILABLE";
	limit?: number;
	current?: number;
	requiredPlan?: string;
};

/**
 * Busca o plano atual do usuário
 */
export async function getUserPlan(userId: string): Promise<PlanType> {
	const [user] = await db
		.select({ subscriptionPlan: users.subscriptionPlan })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return (user?.subscriptionPlan as PlanType) || "free";
}

/**
 * Verifica se o usuário tem acesso a um recurso específico
 */
export async function checkFeatureAccess(
	request: NextRequest,
	feature: keyof ReturnType<typeof getPlanFeatures>,
): Promise<{ ok: true; user: any } | PlanLimitError> {
	const user = await getSessionUser(request);
	if (!user) {
		return {
			ok: false,
			error: "Unauthorized",
			code: "FEATURE_NOT_AVAILABLE",
		};
	}

	const plan = await getUserPlan(user.id);
	const features = getPlanFeatures(plan);

	if (!features[feature]) {
		return {
			ok: false,
			error: `Este recurso não está disponível no plano ${features.displayName}`,
			code: "FEATURE_NOT_AVAILABLE",
			requiredPlan: "standard",
		};
	}

	return { ok: true, user };
}

/**
 * Verifica se o usuário pode criar mais hortas
 */
export async function checkHortaLimit(
	request: NextRequest,
	currentCount: number,
): Promise<{ ok: true; user: any; plan: PlanType } | PlanLimitError> {
	const user = await getSessionUser(request);
	if (!user) {
		return {
			ok: false,
			error: "Unauthorized",
			code: "FEATURE_NOT_AVAILABLE",
		};
	}

	const plan = await getUserPlan(user.id);
	const features = getPlanFeatures(plan);

	if (features.maxHortas !== -1 && currentCount >= features.maxHortas) {
		return {
			ok: false,
			error: `Você atingiu o limite de ${features.maxHortas} hortas no plano ${features.displayName}`,
			code: "PLAN_LIMIT_EXCEEDED",
			limit: features.maxHortas,
			current: currentCount,
			requiredPlan: "standard",
		};
	}

	return { ok: true, user, plan };
}

/**
 * Verifica se o usuário pode adicionar mais plantas em uma horta
 */
export async function checkPlantLimit(
	request: NextRequest,
	currentCount: number,
): Promise<{ ok: true; user: any; plan: PlanType } | PlanLimitError> {
	const user = await getSessionUser(request);
	if (!user) {
		return {
			ok: false,
			error: "Unauthorized",
			code: "FEATURE_NOT_AVAILABLE",
		};
	}

	const plan = await getUserPlan(user.id);
	const features = getPlanFeatures(plan);

	if (features.maxPlantsPerHorta !== -1 && currentCount >= features.maxPlantsPerHorta) {
		return {
			ok: false,
			error: `Você atingiu o limite de ${features.maxPlantsPerHorta} plantas por horta no plano ${features.displayName}`,
			code: "PLAN_LIMIT_EXCEEDED",
			limit: features.maxPlantsPerHorta,
			current: currentCount,
			requiredPlan: currentCount >= 50 ? "premium" : "standard",
		};
	}

	return { ok: true, user, plan };
}

/**
 * Verifica se o usuário pode adicionar mais plantas na base de dados
 */
export async function checkPlantDatabaseLimit(
	request: NextRequest,
	currentCount: number,
): Promise<{ ok: true; user: any; plan: PlanType } | PlanLimitError> {
	const user = await getSessionUser(request);
	if (!user) {
		return {
			ok: false,
			error: "Unauthorized",
			code: "FEATURE_NOT_AVAILABLE",
		};
	}

	const plan = await getUserPlan(user.id);
	const features = getPlanFeatures(plan);

	if (features.maxPlantsInDatabase !== -1 && currentCount >= features.maxPlantsInDatabase) {
		return {
			ok: false,
			error: `Você atingiu o limite de ${features.maxPlantsInDatabase} plantas na base de dados no plano ${features.displayName}`,
			code: "PLAN_LIMIT_EXCEEDED",
			limit: features.maxPlantsInDatabase,
			current: currentCount,
			requiredPlan: currentCount >= 50 ? "premium" : "standard",
		};
	}

	return { ok: true, user, plan };
}

/**
 * Helper para retornar resposta de erro de limite
 */
export function planLimitResponse(error: PlanLimitError): NextResponse {
	return NextResponse.json(error, { status: 403 });
}

/**
 * Middleware para verificar acesso a recursos premium
 */
export async function requirePlanFeature(
	request: NextRequest,
	feature: keyof ReturnType<typeof getPlanFeatures>,
): Promise<NextResponse | null> {
	const result = await checkFeatureAccess(request, feature);
	if (!result.ok) {
		return planLimitResponse(result);
	}
	return null;
}
