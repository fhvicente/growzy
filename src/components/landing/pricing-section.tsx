import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
	locale: string;
}

const plans = [
	{
		name: "Grátis",
		price: "0",
		period: "para sempre",
		description: "Para a primeira varanda.",
		features: ["Até 3 hortas", "Calculadora básica", "20 plantas na base"],
		cta: "Começar grátis",
		highlighted: false,
	},
	{
		name: "Standard",
		price: "4,99",
		period: "/mês",
		yearly: "ou €39/ano",
		description: "Para quem já não pára de plantar.",
		features: [
			"Hortas ilimitadas",
			"Calculadora avançada",
			"50+ plantas na base",
			"Calendário de plantação",
			"Comparação de poupança",
			"Exportação de relatórios",
		],
		cta: "Escolher Standard",
		highlighted: true,
	},
	{
		name: "Premium",
		price: "9,99",
		period: "/mês",
		yearly: "ou €79/ano",
		description: "Para hortas a sério.",
		features: [
			"Tudo do Standard",
			"Planeamento com IA",
			"Previsões de colheita",
			"Alertas personalizados",
			"100+ plantas na base",
		],
		cta: "Escolher Premium",
		highlighted: false,
	},
];

export function PricingSection({ locale }: PricingSectionProps) {
	return (
		<section id="pricing" className="bg-paper py-24 lg:py-40">
			<div className="mx-auto max-w-[88rem] px-4 sm:px-8">
				<div className="mb-16 grid gap-6 lg:mb-24 lg:grid-cols-12 lg:items-end">
					<h2 data-reveal="lines" className="display text-[clamp(2.75rem,6vw,5.5rem)] text-ink lg:col-span-8">
						Começa grátis. Cresce quando quiseres.
					</h2>
					<p data-reveal="up" className="text-lg text-ink-soft lg:col-span-4">
						Sem fidelização. Cancelas nas definições da conta, quando quiseres.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-3 lg:items-stretch lg:gap-0" data-stagger>
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={
								plan.highlighted
									? "relative z-10 flex flex-col rounded-[2rem] bg-moss p-8 text-paper sm:p-10 lg:-my-6 lg:py-16"
									: "flex flex-col rounded-[2rem] border border-ink/15 p-8 text-ink sm:p-10 lg:first:rounded-r-none lg:first:border-r-0 lg:last:rounded-l-none lg:last:border-l-0"
							}
						>
							<div className="flex items-baseline justify-between">
								<h3 className="text-2xl">{plan.name}</h3>
								{plan.highlighted && (
									<span className="rounded-full bg-sprout px-3 py-1 text-xs font-bold text-ink">
										O mais escolhido
									</span>
								)}
							</div>
							<p className={`mt-2 ${plan.highlighted ? "text-paper/75" : "text-ink-soft"}`}>
								{plan.description}
							</p>

							<p className="mt-10 flex items-baseline gap-1">
								<span className="font-display text-2xl font-bold">€</span>
								<span className="font-display text-7xl font-extrabold tracking-tighter tabular-nums">
									{plan.price}
								</span>
								<span className={plan.highlighted ? "text-paper/70" : "text-ink-soft"}>
									{plan.period}
								</span>
							</p>
							<p className={`mt-1 h-5 text-sm ${plan.highlighted ? "text-paper/70" : "text-ink-soft"}`}>
								{plan.yearly}
							</p>

							<ul className="mt-10 flex-1 space-y-3">
								{plan.features.map((f) => (
									<li key={f} className="flex items-start gap-3">
										<Check
											className={`mt-0.5 h-5 w-5 shrink-0 ${plan.highlighted ? "text-sprout" : "text-moss"}`}
											strokeWidth={2.5}
										/>
										<span>{f}</span>
									</li>
								))}
							</ul>

							<Link href={`/${locale}/calculator`} className="mt-10">
								<Button variant={plan.highlighted ? "tomato" : "outline"} size="lg" className="w-full">
									{plan.cta}
								</Button>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
