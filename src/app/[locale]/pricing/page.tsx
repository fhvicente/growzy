import Link from "next/link";
import { headers } from "next/headers";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/pricing/checkout-button";
import { auth } from "@/lib/auth";
import { PLAN_COPY } from "@/lib/plans";

interface PricingPageProps {
	params: Promise<{ locale: string }>;
}

export default async function PricingPage({ params }: PricingPageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	const isLoggedIn = !!session;

	return (
		<div className="min-h-screen bg-paper">
			<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
				<h1 className="display text-4xl text-ink sm:text-5xl">Começa grátis. Cresce quando quiseres.</h1>
				<p className="mt-4 max-w-2xl text-lg text-ink-soft">
					O Grátis responde ao que precisas hoje. O Standard dá-te a época inteira. Sem fidelização.
				</p>

				<div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{PLAN_COPY.map((plan) => {
						const highlighted = plan.type === "standard";
						return (
							<div
								key={plan.type}
								className={
									highlighted
										? "flex min-w-0 flex-col rounded-[2rem] bg-moss p-8 text-paper"
										: "flex min-w-0 flex-col rounded-[2rem] border border-line bg-card p-8 text-ink"
								}
							>
								<h2 className="text-2xl font-bold">{plan.name}</h2>
								<p className={highlighted ? "mt-1 text-paper/75" : "mt-1 text-ink-soft"}>{plan.description}</p>
								<p className="mt-8 flex items-baseline gap-1">
									<span className="font-display text-xl font-bold">€</span>
									<span className="font-display text-6xl font-extrabold tracking-tighter tabular-nums">{plan.price}</span>
									<span className={highlighted ? "text-paper/70" : "text-ink-soft"}>{plan.period}</span>
								</p>
								<p className={`mt-1 h-5 text-sm ${highlighted ? "text-paper/70" : "text-ink-soft"}`}>{plan.yearly}</p>
								<ul className="mt-8 flex-1 space-y-3">
									{plan.features.map((f) => (
										<li key={f} className="flex items-start gap-3">
											<Check className={`mt-0.5 h-5 w-5 shrink-0 ${highlighted ? "text-sprout" : "text-moss"}`} strokeWidth={2.5} />
											<span>{f}</span>
										</li>
									))}
								</ul>
								<div className="mt-8">
									{!plan.available ? (
										<span className="block rounded-full border border-dashed border-current py-3 text-center font-semibold opacity-70">
											Em breve
										</span>
									) : plan.type === "standard" && isLoggedIn ? (
										<CheckoutButton plan="standard" label="Escolher Standard" />
									) : (
										<Link href={isLoggedIn ? `/${locale}/calculator` : `/${locale}/register`}>
											<Button variant={highlighted ? "tomato" : "outline"} size="lg" className="w-full">
												{plan.type === "free" ? "Começar grátis" : "Criar conta e escolher Standard"}
											</Button>
										</Link>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
