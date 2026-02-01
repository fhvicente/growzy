import { Reveal, StaggerReveal } from "./reveal";

const steps = [
	{
		number: "1",
		title: "Escolha as Suas Plantas",
		description:
			"Selecione as plantas que quer cultivar da nossa base de dados. Veja preços e características de cada uma.",
	},
	{
		number: "2",
		title: "Calcule os Custos",
		description:
			"A calculadora mostra automaticamente o investimento total: plantas, terra, vasos, fertilizantes e ferramentas.",
	},
	{
		number: "3",
		title: "Comece a Cultivar",
		description:
			"Siga o plano personalizado, acompanhe o progresso e registe as colheitas para ver as suas economias.",
	},
];

export function HowItWorksSection() {
	return (
		<section id="how-it-works" className="bg-gray-50 py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<Reveal direction="up">
					<div className="text-center">
						<p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-600">
							Como Funciona
						</p>
						<h2 className="mb-12 text-4xl font-bold tracking-tight text-gray-900 lg:mb-16 lg:text-5xl">
							Comece em 3 Passos Simples
						</h2>
					</div>
				</Reveal>

				{/* Steps */}
				<div className="relative mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{/* Connector line (desktop only) */}
					<div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-linear-to-r from-primary-200 via-primary-300 to-primary-200 lg:block" />

					<StaggerReveal staggerDelay={200} direction="up">
						{steps.map((step, index) => (
							<div
								key={index}
								className="relative rounded-xl bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
							>
								{/* Step Number Circle */}
								<div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-3xl font-bold text-white shadow-lg">
									{step.number}
								</div>

								{/* Title */}
								<h3 className="mb-3 text-xl font-semibold text-gray-900">{step.title}</h3>

								{/* Description */}
								<p className="text-muted-foreground leading-relaxed">{step.description}</p>
							</div>
						))}
					</StaggerReveal>
				</div>
			</div>
		</section>
	);
}
