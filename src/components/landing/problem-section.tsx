import { Calculator, Calendar, TrendingDown } from "lucide-react";
import { Reveal, StaggerReveal } from "./reveal";

const painPoints = [
	{
		icon: Calculator,
		title: "Custos Imprevisíveis",
		description:
			"Difícil calcular o investimento total antes de começar. Gastos com plantas, terra, fertilizantes e ferramentas podem surpreender.",
	},
	{
		icon: Calendar,
		title: "Planeamento Confuso",
		description:
			"Quando plantar cada cultura? Quanto espaço preciso? Quantas plantas cabem na minha varanda? Demasiadas dúvidas.",
	},
	{
		icon: TrendingDown,
		title: "Sem Controlo de Gastos",
		description:
			"Difícil acompanhar despesas ao longo do tempo e comparar com o preço dos alimentos no supermercado.",
	},
];

export function ProblemSection() {
	return (
		<section id="problem" className="bg-gray-50 py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<Reveal direction="up">
					<div className="text-center">
						<p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-600">
							O Problema
						</p>
						<h2 className="mx-auto mb-12 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 lg:mb-16 lg:text-5xl">
							Planear Uma Horta Não Devia Ser Complicado
						</h2>
					</div>
				</Reveal>

				{/* Pain Point Cards */}
				<div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<StaggerReveal staggerDelay={150} direction="up">
						{painPoints.map((point, index) => {
							const Icon = point.icon;
							return (
								<div
									key={index}
									className="group rounded-xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
								>
									<div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-red-50">
										<Icon className="h-7 w-7 text-red-500" />
									</div>
									<h3 className="mb-3 text-lg font-semibold text-gray-900">{point.title}</h3>
									<p className="text-muted-foreground leading-relaxed">{point.description}</p>
								</div>
							);
						})}
					</StaggerReveal>
				</div>
			</div>
		</section>
	);
}
