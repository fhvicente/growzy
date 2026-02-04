/**
 * Planos de assinatura disponíveis e suas limitações
 */

export const PLAN_TYPES = {
	FREE: "free",
	STANDARD: "standard",
	PREMIUM: "premium",
} as const;

export type PlanType = (typeof PLAN_TYPES)[keyof typeof PLAN_TYPES];

export interface PlanFeatures {
	name: string;
	displayName: string;
	maxHortas: number;
	maxPlantsPerHorta: number;
	maxPlantsInDatabase: number;
	hasAdvancedCalculator: boolean;
	hasProgressTracking: boolean;
	hasPlantingCalendar: boolean;
	hasEconomyComparison: boolean;
	hasReportExport: boolean;
	hasPrioritySupport: boolean;
	hasAIPlanning: boolean;
	hasAdvancedSoilAnalysis: boolean;
	hasHarvestPredictions: boolean;
	hasPersonalizedAlerts: boolean;
	hasVirtualConsultation: boolean;
	hasAPIAccess: boolean;
	has24x7Support: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
	[PLAN_TYPES.FREE]: {
		name: "free",
		displayName: "Grátis",
		maxHortas: 3,
		maxPlantsPerHorta: 20,
		maxPlantsInDatabase: 20,
		hasAdvancedCalculator: false,
		hasProgressTracking: false,
		hasPlantingCalendar: false,
		hasEconomyComparison: false,
		hasReportExport: false,
		hasPrioritySupport: false,
		hasAIPlanning: false,
		hasAdvancedSoilAnalysis: false,
		hasHarvestPredictions: false,
		hasPersonalizedAlerts: false,
		hasVirtualConsultation: false,
		hasAPIAccess: false,
		has24x7Support: false,
	},
	[PLAN_TYPES.STANDARD]: {
		name: "standard",
		displayName: "Standard",
		maxHortas: -1, // ilimitado
		maxPlantsPerHorta: 50,
		maxPlantsInDatabase: 50,
		hasAdvancedCalculator: true,
		hasProgressTracking: true,
		hasPlantingCalendar: true,
		hasEconomyComparison: true,
		hasReportExport: true,
		hasPrioritySupport: true,
		hasAIPlanning: false,
		hasAdvancedSoilAnalysis: false,
		hasHarvestPredictions: false,
		hasPersonalizedAlerts: false,
		hasVirtualConsultation: false,
		hasAPIAccess: false,
		has24x7Support: false,
	},
	[PLAN_TYPES.PREMIUM]: {
		name: "premium",
		displayName: "Premium",
		maxHortas: -1, // ilimitado
		maxPlantsPerHorta: 100,
		maxPlantsInDatabase: 100,
		hasAdvancedCalculator: true,
		hasProgressTracking: true,
		hasPlantingCalendar: true,
		hasEconomyComparison: true,
		hasReportExport: true,
		hasPrioritySupport: true,
		hasAIPlanning: true,
		hasAdvancedSoilAnalysis: true,
		hasHarvestPredictions: true,
		hasPersonalizedAlerts: true,
		hasVirtualConsultation: true,
		hasAPIAccess: true,
		has24x7Support: true,
	},
};

/**
 * Mapeia o Stripe Price ID para o tipo de plano
 */
export function getPlanFromPriceId(priceId: string): PlanType {
	if (priceId === process.env.STRIPE_STANDARD_PRICE_ID) {
		return PLAN_TYPES.STANDARD;
	}
	if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
		return PLAN_TYPES.PREMIUM;
	}
	return PLAN_TYPES.FREE;
}

/**
 * Retorna os recursos de um plano específico
 */
export function getPlanFeatures(planType: PlanType): PlanFeatures {
	return PLAN_FEATURES[planType] || PLAN_FEATURES[PLAN_TYPES.FREE];
}

/**
 * Verifica se um plano tem acesso a um recurso específico
 */
export function hasFeatureAccess(
	planType: PlanType,
	feature: keyof Omit<
		PlanFeatures,
		"name" | "displayName" | "maxHortas" | "maxPlantsPerHorta" | "maxPlantsInDatabase"
	>,
): boolean {
	const features = getPlanFeatures(planType);
	return features[feature] === true;
}

/**
 * Verifica se o usuário atingiu o limite de hortas
 */
export function canCreateHorta(planType: PlanType, currentCount: number): boolean {
	const features = getPlanFeatures(planType);
	if (features.maxHortas === -1) return true; // ilimitado
	return currentCount < features.maxHortas;
}

/**
 * Verifica se o usuário pode adicionar mais plantas
 */
export function canAddPlant(planType: PlanType, currentCount: number): boolean {
	const features = getPlanFeatures(planType);
	if (features.maxPlantsPerHorta === -1) return true; // ilimitado
	return currentCount < features.maxPlantsPerHorta;
}

/**
 * Verifica se o usuário pode adicionar mais plantas na base de dados
 */
export function canAddPlantToDatabase(planType: PlanType, currentCount: number): boolean {
	const features = getPlanFeatures(planType);
	if (features.maxPlantsInDatabase === -1) return true; // ilimitado
	return currentCount < features.maxPlantsInDatabase;
}
