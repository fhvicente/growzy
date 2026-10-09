/**
 * Planos e o que cada um inclui. Só entra aqui o que já existe na app.
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
	maxHortas: number; // -1 = ilimitado
	fullYearWatering: boolean;
	fullYearCalendar: boolean;
	savingsDetail: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
	free: { name: "free", displayName: "Grátis", maxHortas: 3, fullYearWatering: false, fullYearCalendar: false, savingsDetail: false },
	standard: { name: "standard", displayName: "Standard", maxHortas: -1, fullYearWatering: true, fullYearCalendar: true, savingsDetail: true },
	premium: { name: "premium", displayName: "Premium", maxHortas: -1, fullYearWatering: true, fullYearCalendar: true, savingsDetail: true },
};

export type PlanCopy = {
	type: PlanType;
	name: string;
	price: string;
	period: string;
	yearly?: string;
	description: string;
	features: string[];
	available: boolean; // false = "Em breve", sem compra
};

// Fonte única para a landing e /pricing.
export const PLAN_COPY: PlanCopy[] = [
	{
		type: "free",
		name: "Grátis",
		price: "0",
		period: "para sempre",
		description: "Para a primeira varanda.",
		features: [
			"Planeia a horta a partir das medidas do teu espaço",
			"Lista de compras e custo, só com o que precisas",
			"Rega e calendário do mês atual",
			"Quanto poupas e quando a horta se paga",
			"Até 3 hortas guardadas",
		],
		available: true,
	},
	{
		type: "standard",
		name: "Standard",
		price: "4,99",
		period: "/mês",
		yearly: "ou €39/ano",
		description: "Para a época inteira.",
		features: [
			"Tudo do Grátis",
			"Hortas ilimitadas",
			"Rega mês a mês, o ano todo",
			"Calendário de 12 meses para a tua zona",
			"Poupança por cultura e a partir da 2.ª época",
		],
		available: true,
	},
	{
		type: "premium",
		name: "Premium",
		price: "9,99",
		period: "/mês",
		yearly: "ou €79/ano",
		description: "Em breve.",
		features: ["Tudo do Standard", "Rega ajustada à meteorologia do IPMA", "Alertas de geada e calor"],
		available: false,
	},
];

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

export function getPlanFeatures(planType: PlanType): PlanFeatures {
	return PLAN_FEATURES[planType] || PLAN_FEATURES[PLAN_TYPES.FREE];
}
