import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_COPY } from "@/lib/plans";

interface PricingSectionProps {
	locale: string;
}

const CTA: Record<string, string> = { free: "Começar grátis", standard: "Escolher Standard" };

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
					{PLAN_COPY.map((plan) => (
						<div
							key={plan.type}
							className={
								plan.type === "standard"
									? "relative z-10 flex flex-col rounded-[2rem] bg-moss p-8 text-paper sm:p-10 lg:-my-6 lg:py-16"
									: "flex flex-col rounded-[2rem] border border-ink/15 p-8 text-ink sm:p-10 lg:first:rounded-r-none lg:first:border-r-0 lg:last:rounded-l-none lg:last:border-l-0"
							}
						>
							<div className="flex items-baseline justify-between">
								<h3 className="text-2xl">{plan.name}</h3>
							</div>
							<p className={`mt-2 ${plan.type === "standard" ? "text-paper/75" : "text-ink-soft"}`}>
								{plan.description}
							</p>

							<p className="mt-10 flex items-baseline gap-1">
								<span className="font-display text-2xl font-bold">€</span>
								<span className="font-display text-7xl font-extrabold tracking-tighter tabular-nums">
									{plan.price}
								</span>
								<span className={plan.type === "standard" ? "text-paper/70" : "text-ink-soft"}>
									{plan.period}
								</span>
							</p>
							<p className={`mt-1 h-5 text-sm ${plan.type === "standard" ? "text-paper/70" : "text-ink-soft"}`}>
								{plan.yearly}
							</p>

							<ul className="mt-10 flex-1 space-y-3">
								{plan.features.map((f) => (
									<li key={f} className="flex items-start gap-3">
										<Check
											className={`mt-0.5 h-5 w-5 shrink-0 ${plan.type === "standard" ? "text-sprout" : "text-moss"}`}
											strokeWidth={2.5}
										/>
										<span>{f}</span>
									</li>
								))}
							</ul>

							{plan.available ? (
								<Link href={`/${locale}/calculator`} className="mt-10">
									<Button variant={plan.type === "standard" ? "tomato" : "outline"} size="lg" className="w-full">
										{CTA[plan.type]}
									</Button>
								</Link>
							) : (
								<span className="mt-10 block rounded-full border border-dashed border-ink/30 py-4 text-center font-semibold text-ink-soft">
									Em breve
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
