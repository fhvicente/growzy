import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
	locale: string;
}

const receipt = [
	{ qty: 5, name: "Tomate cherry", price: 12.5 },
	{ qty: 3, name: "Alface", price: 4.5 },
	{ qty: 2, name: "Manjericão", price: 3.6 },
];
const total = receipt.reduce((s, r) => s + r.price, 0);

const plants = [
	"manjericão",
	"tomate cherry",
	"alface",
	"hortelã",
	"pimento",
	"salsa",
	"morango",
	"coentros",
	"rúcula",
];

const eur = (n: number) => n.toLocaleString("pt-PT", { minimumFractionDigits: 2 });

export function HeroSection({ locale }: HeroSectionProps) {
	return (
		<section id="hero" className="relative overflow-hidden bg-moss text-paper">
			<div className="mx-auto grid max-w-[88rem] gap-12 px-4 pb-16 pt-32 sm:px-8 lg:min-h-[100svh] lg:grid-cols-12 lg:items-end lg:gap-8 lg:pb-24 lg:pt-36">
				<div className="lg:col-span-7">
					<p data-reveal="up" className="mb-8 text-sm font-medium text-sprout">
						Calculadora de hortas · feita em Portugal
					</p>
					<h1 data-reveal="lines" className="display text-[clamp(3.5rem,11vw,10rem)] text-paper">
						Cultiva sem <span className="text-sprout">adivinhar.</span>
					</h1>
					<p
						data-reveal="up"
						data-delay="0.35"
						className="mt-8 max-w-[34ch] text-lg leading-relaxed text-paper/80 sm:text-xl"
					>
						Escolhe as plantas, diz quantas queres e a Growzy mostra quanto vais gastar antes de saíres para
						o viveiro.
					</p>
					<div
						data-reveal="up"
						data-delay="0.5"
						className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
					>
						<Link href={`/${locale}/calculator`}>
							<Button variant="tomato" size="lg" className="group">
								Calcular a minha horta
								<ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
							</Button>
						</Link>
						<Link
							href={`/${locale}/pricing`}
							className="text-base font-semibold text-paper underline decoration-paper/30 underline-offset-[6px] transition-colors hover:decoration-sprout"
						>
							Ver planos
						</Link>
					</div>
					<p data-reveal="up" data-delay="0.6" className="mt-5 text-sm text-paper/60">
						Grátis até 3 hortas. Sem cartão.
					</p>
				</div>

				{/* Photo + receipt */}
				<div className="relative lg:col-span-5">
					<div
						data-reveal="up"
						data-delay="0.2"
						className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"
					>
						<img
							data-parallax="-8"
							src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=1200&q=80"
							alt="Mãos com luvas a assentar uma muda de abóbora em terra escura"
							className="absolute inset-0 h-[116%] w-full object-cover"
						/>
					</div>

					<div
						data-reveal="up"
						data-delay="0.7"
						className="absolute -bottom-8 -left-4 w-[17.5rem] -rotate-3 sm:-left-16 sm:w-80"
					>
						<div className="receipt bg-paper px-6 pb-8 pt-9 text-ink shadow-[6px_6px_0_var(--color-moss-deep)]">
							<p className="mb-4 flex justify-between text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
								<span>Exemplo</span>
								<span>varanda 2 m²</span>
							</p>
							<ul className="space-y-2 border-b border-dashed border-ink/25 pb-4 text-sm tabular-nums">
								{receipt.map((r) => (
									<li key={r.name} className="flex justify-between gap-4">
										<span>
											<span className="text-ink-soft">{r.qty}×</span> {r.name}
										</span>
										<span>€{eur(r.price)}</span>
									</li>
								))}
							</ul>
							<p className="mt-4 flex items-baseline justify-between">
								<span className="text-sm font-semibold">Total</span>
								<span className="font-display text-4xl font-extrabold tracking-tight tabular-nums">
									€
									<span data-count={total.toFixed(2)} data-delay="0.9">
										{eur(total)}
									</span>
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Marquee */}
			<div className="relative border-t border-paper/15 py-5" aria-hidden="true">
				<div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-2xl font-bold tracking-tight text-paper/45 sm:text-3xl">
					{[...plants, ...plants].map((p, i) => (
						<span key={i} className="flex items-center gap-10">
							{p}
							<span className="h-2 w-2 rounded-full bg-tomato" />
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
