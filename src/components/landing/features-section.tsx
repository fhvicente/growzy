// Stacked sticky panels: pure CSS (position: sticky), each one slides over the previous.

const months = [
	{ m: "Mar", v: 38 },
	{ m: "Abr", v: 22 },
	{ m: "Mai", v: 9 },
	{ m: "Jun", v: 14 },
	{ m: "Jul", v: 6 },
	{ m: "Ago", v: 4 },
];
const maxMonth = Math.max(...months.map((m) => m.v));

function PanelText({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col justify-between gap-10 lg:col-span-5">
			<span className="font-display text-sm font-bold tracking-[0.2em] opacity-60">{n} / 03</span>
			<div>
				<h3 className="display mb-6 text-[clamp(2.5rem,5vw,4.5rem)]">{title}</h3>
				<p className="max-w-[40ch] text-lg leading-relaxed opacity-80">{children}</p>
			</div>
		</div>
	);
}

export function FeaturesSection() {
	return (
		<section id="features" className="bg-paper pb-24 lg:pb-40">
			<div className="mx-auto max-w-[88rem] px-4 sm:px-8">
				<h2
					data-reveal="lines"
					className="display mb-14 max-w-[14ch] text-[clamp(2.75rem,6vw,5.5rem)] text-ink lg:mb-20"
				>
					Três coisas, bem feitas.
				</h2>

				<div className="space-y-6">
					{/* 01 Calculadora */}
					<article className="lg:sticky lg:top-24 grid min-h-[34rem] gap-10 rounded-[2rem] bg-sprout p-8 text-ink sm:p-12 lg:grid-cols-12 lg:p-16">
						<PanelText n="01" title="Calculadora">
							Escolhes da base de plantas com preços do mercado português, ajustas quantidades e o total
							muda à frente dos teus olhos.
						</PanelText>
						<div className="flex items-center lg:col-span-6 lg:col-start-7">
							<ul className="w-full divide-y divide-ink/15 rounded-[1.5rem] bg-paper p-2 text-ink shadow-[6px_6px_0_var(--color-moss)]">
								{[
									["Tomate cherry", 5, "12,50"],
									["Hortelã", 2, "3,20"],
									["Morango", 6, "10,80"],
								].map(([name, qty, price]) => (
									<li key={name} className="flex items-center gap-4 px-4 py-4">
										<span className="flex-1 font-semibold">{name}</span>
										<span className="flex items-center gap-3 rounded-full border border-line px-3 py-1 text-sm tabular-nums">
											<span className="text-ink-soft">−</span>
											{qty}
											<span className="text-ink-soft">+</span>
										</span>
										<span className="w-16 text-right tabular-nums">€{price}</span>
									</li>
								))}
								<li className="flex items-baseline justify-between px-4 py-5">
									<span className="text-sm font-semibold">Total</span>
									<span className="font-display text-3xl font-extrabold tabular-nums">€26,50</span>
								</li>
							</ul>
						</div>
					</article>

					{/* 02 Guardar */}
					<article className="lg:sticky lg:top-28 grid min-h-[34rem] gap-10 overflow-hidden rounded-[2rem] bg-moss-deep p-8 text-paper sm:p-12 lg:grid-cols-12 lg:p-16">
						<PanelText n="02" title="Guarda cada horta">
							Varanda, terraço, a horta da avó. Cada cálculo fica guardado para voltares a ele, mudar
							quantidades e recalcular quando os preços mudam.
						</PanelText>
						<div className="relative min-h-72 overflow-hidden rounded-[1.5rem] lg:col-span-6 lg:col-start-7">
							<img
								data-parallax="-10"
								src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80"
								alt="Vasos pretos vistos de cima, cada um com uma muda verde a despontar"
								className="absolute inset-0 h-[115%] w-full object-cover"
								loading="lazy"
							/>
						</div>
					</article>

					{/* 03 Dashboard */}
					<article className="lg:sticky lg:top-32 grid min-h-[34rem] gap-10 rounded-[2rem] bg-paper-2 p-8 text-ink sm:p-12 lg:grid-cols-12 lg:p-16">
						<PanelText n="03" title="Vê onde vai o dinheiro">
							O dashboard junta o que gastaste em todas as hortas. Ao fim da época sabes exatamente quanto
							custou cultivar.
						</PanelText>
						<figure className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
							<div className="flex h-64 items-end gap-3 border-b border-ink/20 sm:gap-5" data-stagger>
								{months.map((m) => (
									<div key={m.m} className="flex flex-1 flex-col items-center gap-2">
										<span className="text-xs tabular-nums text-ink-soft">€{m.v}</span>
										<div
											className="w-full rounded-t-xl bg-moss"
											style={{ height: `${(m.v / maxMonth) * 12}rem` }}
										/>
									</div>
								))}
							</div>
							<div className="mt-3 flex gap-3 sm:gap-5">
								{months.map((m) => (
									<span key={m.m} className="flex-1 text-center text-sm font-semibold">
										{m.m}
									</span>
								))}
							</div>
							<figcaption className="mt-6 text-sm text-ink-soft">
								Gastos de exemplo de uma época, por mês.
							</figcaption>
						</figure>
					</article>
				</div>
			</div>
		</section>
	);
}
