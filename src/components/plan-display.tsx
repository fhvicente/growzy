"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Zap } from "lucide-react";
import { PLAN_FEATURES, type PlanType } from "@/lib/plans";

interface PlanDisplayProps {
	planType: PlanType;
	subscriptionStatus?: string;
	showUpgrade?: boolean;
}

export function PlanDisplay({ planType, subscriptionStatus, showUpgrade = true }: PlanDisplayProps) {
	const features = PLAN_FEATURES[planType];
	const isActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							Plano {features.displayName}
							{isActive && (
								<Badge variant="default" className="gap-1">
									<Zap className="h-3 w-3" />
									Ativo
								</Badge>
							)}
							{subscriptionStatus === "past_due" && (
								<Badge variant="destructive">Pagamento Pendente</Badge>
							)}
						</CardTitle>
						<CardDescription>Recursos do seu plano atual</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-2">
					<FeatureItem
						label="Hortas"
						value={features.maxHortas === -1 ? "Ilimitadas" : `Até ${features.maxHortas}`}
						available={true}
					/>
					<FeatureItem
						label="Plantas por horta"
						value={features.maxPlantsPerHorta === -1 ? "Ilimitadas" : `Até ${features.maxPlantsPerHorta}`}
						available={true}
					/>
					<FeatureItem
						label="Plantas na base de dados"
						value={
							features.maxPlantsInDatabase === -1 ? "Ilimitadas" : `Até ${features.maxPlantsInDatabase}`
						}
						available={true}
					/>
					<FeatureItem label="Calculadora avançada" available={features.hasAdvancedCalculator} />
					<FeatureItem label="Acompanhamento de progresso" available={features.hasProgressTracking} />
					<FeatureItem label="Calendário de plantação" available={features.hasPlantingCalendar} />
					<FeatureItem label="Comparação de economias" available={features.hasEconomyComparison} />
					<FeatureItem label="Exportação de relatórios" available={features.hasReportExport} />
					<FeatureItem label="Suporte prioritário" available={features.hasPrioritySupport} />

					{planType === "premium" && (
						<>
							<FeatureItem label="Planeamento com IA" available={features.hasAIPlanning} />
							<FeatureItem
								label="Análise avançada de solo"
								available={features.hasAdvancedSoilAnalysis}
							/>
							<FeatureItem label="Previsões de colheita" available={features.hasHarvestPredictions} />
							<FeatureItem label="Alertas personalizados" available={features.hasPersonalizedAlerts} />
							<FeatureItem label="Consultoria virtual" available={features.hasVirtualConsultation} />
							<FeatureItem label="Acesso à API" available={features.hasAPIAccess} />
							<FeatureItem label="Suporte 24/7" available={features.has24x7Support} />
						</>
					)}
				</div>

				{showUpgrade && planType !== "premium" && (
					<div className="mt-4 rounded-lg bg-muted p-4">
						<p className="text-sm text-muted-foreground">
							{planType === "free"
								? "Faça upgrade para Standard ou Premium para desbloquear mais recursos!"
								: "Faça upgrade para Premium para recursos avançados com IA!"}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface FeatureItemProps {
	label: string;
	value?: string;
	available: boolean;
}

function FeatureItem({ label, value, available }: FeatureItemProps) {
	return (
		<div className="flex items-center gap-2 text-sm">
			{available ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" />}
			<span className={available ? "" : "text-muted-foreground"}>
				{label}
				{value && <span className="font-medium"> - {value}</span>}
			</span>
		</div>
	);
}
