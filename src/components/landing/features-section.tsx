import { Calculator, Leaf, TrendingDown, Smartphone, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./reveal";

const features = [
	{
		icon: Calculator,
		title: "Calculadora de Custos Precisa",
		description:
			"Calcule o investimento total da sua horta antes de começar. Adicione plantas, terra, fertilizantes e veja os custos em tempo real.",
		benefits: [
			"Base de dados com 50+ plantas comuns",
			"Preços atualizados do mercado português",
			"Cálculo automático de materiais necessários",
			"Comparação com preços de supermercado",
		],
		imagePosition: "left" as const,
	},
	{
		icon: Leaf,
		title: "Planeamento Inteligente",
		description:
			"Organize a sua horta por espaço disponível, época do ano e compatibilidade entre plantas. Receba sugestões personalizadas.",
		benefits: [
			"Calendário de plantação por região",
			"Compatibilidade entre culturas",
			"Otimização de espaço",
			"Guias de cuidados para cada planta",
		],
		imagePosition: "right" as const,
	},
	{
		icon: TrendingDown,
		title: "Acompanhamento de Economias",
		description:
			"Veja quanto está a poupar ao cultivar em casa. Compare custos de produção vs. supermercado e acompanhe o retorno do investimento.",
		benefits: [
			"Dashboard com gastos totais",
			"Cálculo de poupanças realizadas",
			"Histórico de colheitas",
			"Métricas de produtividade",
		],
		imagePosition: "left" as const,
	},
	{
		icon: Smartphone,
		title: "Acesso em Qualquer Lugar",
		description:
			"Sincronize os seus dados entre dispositivos. Planeie no computador, consulte no telemóvel enquanto está na horta ou loja.",
		benefits: [
			"Aplicação web responsiva",
			"Funciona offline",
			"Dados guardados na cloud",
			"Exportação de listas de compras",
		],
		imagePosition: "right" as const,
	},
];

export function FeaturesSection() {
	return (
		<section id="features" className="bg-white py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<Reveal direction="up">
					<div className="text-center">
						<p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-600">A Solução</p>
						<h2 className="mx-auto mb-4 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
							Tudo o Que Precisa Para Cultivar com Sucesso
						</h2>
						<p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
							Da calculadora ao acompanhamento, gerir a sua horta nunca foi tão simples
						</p>
					</div>
				</Reveal>

				{/* Features List */}
				<div className="space-y-24 lg:space-y-32">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						const isLeft = feature.imagePosition === "left";

						return (
							<Reveal key={index} direction={isLeft ? "left" : "right"} delay={index * 100}>
								<div
									className={`grid items-center gap-12 lg:grid-cols-2 ${
										isLeft ? "" : "lg:grid-flow-dense"
									}`}
								>
									{/* Image/Mockup */}
									<div className={`relative ${isLeft ? "" : "lg:col-start-2"}`}>
										<div className="relative aspect-video overflow-hidden rounded-xl border-2 border-primary-200 bg-linear-to-br from-primary-50 to-primary-100 shadow-xl">
											{/* Placeholder for screenshot - replace with actual image */}
											<div className="flex h-full items-center justify-center">
												<Icon className="h-24 w-24 text-primary-300" />
											</div>
										</div>
									</div>

									{/* Content */}
									<div className={isLeft ? "" : "lg:col-start-1 lg:row-start-1"}>
										{/* Icon Badge */}
										<div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600/10">
											<Icon className="h-7 w-7 text-primary-600" />
										</div>

										{/* Title */}
										<h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
											{feature.title}
										</h3>

										{/* Description */}
										<p className="mb-6 text-lg leading-relaxed text-muted-foreground">
											{feature.description}
										</p>

										{/* Benefits List */}
										<ul className="space-y-3">
											{feature.benefits.map((benefit, benefitIndex) => (
												<li key={benefitIndex} className="flex items-start gap-3">
													<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
													<span className="text-gray-900">{benefit}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
