import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Reveal, StaggerReveal } from "./reveal";

interface PricingSectionProps {
	locale: string;
}

const plans = [
	{
		name: "Grátis",
		price: "€0",
		period: "para sempre",
		description: "Perfeito para começar",
		features: ["Até 3 hortas", "Calculadora básica", "20 plantas na base de dados", "Sem acompanhamento"],
		cta: "Começar Grátis",
		popular: false,
		highlighted: false,
	},
	{
		name: "Standard",
		price: "€4.99",
		period: "/mês",
		yearlyPrice: "€39",
		description: "Ideal para horticultores regulares",
		features: [
			"Hortas ilimitadas",
			"Calculadora avançada",
			"50+ plantas na base de dados",
			"Acompanhamento de progresso",
			"Calendário de plantação",
			"Comparação de economias",
			"Exportação de relatórios",
			"Suporte prioritário",
		],
		cta: "Começar Teste Grátis",
		popular: true,
		highlighted: true,
	},
	{
		name: "Premium",
		price: "€9.99",
		period: "/mês",
		yearlyPrice: "€79",
		description: "Para profissionais e entusiastas",
		features: [
			"Tudo em Standard",
			"Planeamento com IA",
			"Análise avançada de solo",
			"Previsões de colheita",
			"Alertas personalizados",
			"Consultoria virtual",
			"Base de dados completa (100+ plantas)",
			"API access",
			"Suporte 24/7",
		],
		cta: "Começar Teste Grátis",
		popular: false,
		highlighted: false,
	},
];

export function PricingSection({ locale }: PricingSectionProps) {
	return (
		<section id="pricing" className="bg-white py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<Reveal direction="up">
					<div className="text-center">
						<p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-600">
							Preços Simples
						</p>
						<h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
							Comece Grátis, Atualize Quando Quiser
						</h2>
						<p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground lg:mb-16">
							Escolha o plano ideal para o seu projeto de horticultura
						</p>
					</div>
				</Reveal>

				{/* Pricing Cards */}
				<div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
					<StaggerReveal staggerDelay={150} direction="up">
						{plans.map((plan, index) => (
							<div
								key={index}
								className={`relative flex flex-col rounded-xl border-2 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
									plan.highlighted ? "border-primary-600 shadow-primary-100" : "border-gray-200"
								}`}
							>
								{/* Popular Badge */}
								{plan.popular && (
									<div className="absolute -top-4 left-1/2 -translate-x-1/2">
										<span className="inline-flex rounded-full bg-primary-600 px-4 py-1 text-sm font-semibold text-white shadow-sm">
											Mais Popular
										</span>
									</div>
								)}

								{/* Plan Name */}
								<div className="mb-4">
									<h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
									<p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
								</div>

								{/* Price */}
								<div className="mb-6">
									<div className="flex items-baseline gap-1">
										<span className="text-5xl font-bold tracking-tight text-gray-900">
											{plan.price}
										</span>
										<span className="text-muted-foreground">{plan.period}</span>
									</div>
									{plan.yearlyPrice && (
										<p className="mt-1 text-sm text-muted-foreground">
											ou {plan.yearlyPrice}/ano (poupe 34%)
										</p>
									)}
								</div>

								{/* CTA Button */}
								<Link href={`/${locale}/calculator`} className="mb-6">
									<Button
										className={`w-full ${
											plan.highlighted
												? "bg-primary-600 text-white hover:bg-primary-700"
												: "border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50"
										}`}
										size="lg"
									>
										{plan.cta}
									</Button>
								</Link>

								{/* Features List */}
								<ul className="space-y-3 text-sm">
									{plan.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-start gap-3">
											<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
											<span className="text-gray-900">{feature}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</StaggerReveal>
				</div>

				{/* Trust Message */}
				<div className="mt-12 text-center">
					<p className="text-sm text-muted-foreground">
						Teste grátis durante 14 dias. Sem cartão necessário. Cancele quando quiser.
					</p>
				</div>
			</div>
		</section>
	);
}
