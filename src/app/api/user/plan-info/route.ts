import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { users, calculations } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { getPlanFeatures } from "@/lib/plans";

/**
 * API para obter informações do dashboard incluindo limites do plano
 */
export async function GET(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	// Buscar dados do usuário
	const [userData] = await db
		.select({
			subscriptionPlan: users.subscriptionPlan,
			subscriptionStatus: users.subscriptionStatus,
		})
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	const planType = (userData?.subscriptionPlan as any) || "free";
	const features = getPlanFeatures(planType);

	// Contar cálculos (hortas) do usuário
	const [calculationsCount] = await db
		.select({ count: count() })
		.from(calculations)
		.where(eq(calculations.userId, user.id));

	// Calcular plantas totais nos cálculos
	const userCalculations = await db
		.select({ plantsCount: calculations.plantsCount })
		.from(calculations)
		.where(eq(calculations.userId, user.id));

	const totalPlants = userCalculations.reduce((sum, calc) => sum + (calc.plantsCount || 0), 0);

	return NextResponse.json({
		ok: true,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
		},
		subscription: {
			plan: planType,
			status: userData?.subscriptionStatus,
			displayName: features.displayName,
		},
		limits: {
			hortas: {
				current: calculationsCount?.count || 0,
				max: features.maxHortas,
				unlimited: features.maxHortas === -1,
				percentage:
					features.maxHortas === -1 ? 0 : ((calculationsCount?.count || 0) / features.maxHortas) * 100,
			},
			plants: {
				current: totalPlants,
				max: features.maxPlantsInDatabase,
				unlimited: features.maxPlantsInDatabase === -1,
				percentage:
					features.maxPlantsInDatabase === -1 ? 0 : (totalPlants / features.maxPlantsInDatabase) * 100,
			},
		},
		features: {
			hasAdvancedCalculator: features.hasAdvancedCalculator,
			hasProgressTracking: features.hasProgressTracking,
			hasPlantingCalendar: features.hasPlantingCalendar,
			hasEconomyComparison: features.hasEconomyComparison,
			hasReportExport: features.hasReportExport,
			hasPrioritySupport: features.hasPrioritySupport,
			hasAIPlanning: features.hasAIPlanning,
			hasAdvancedSoilAnalysis: features.hasAdvancedSoilAnalysis,
			hasHarvestPredictions: features.hasHarvestPredictions,
			hasPersonalizedAlerts: features.hasPersonalizedAlerts,
			hasVirtualConsultation: features.hasVirtualConsultation,
			hasAPIAccess: features.hasAPIAccess,
			has24x7Support: features.has24x7Support,
		},
	});
}
