const steps = [
	{
		title: "Mede o espaço",
		description: "Largura, comprimento, quanta luz tem e a tua zona.",
	},
	{
		title: "Escolhe o que plantar",
		description: "A Growzy diz quantas cabem, o que comprar e quanto custa.",
	},
	{
		title: "Rega e colhe",
		description: "Quanto regar este mês, quando semear e colher, e se compensa.",
	},
];

function Leaf({ flip }: { flip?: boolean }) {
	return (
		<svg
			viewBox="0 0 48 32"
			aria-hidden="true"
			data-leaf="50% 100%"
			className={`absolute left-0 top-0 h-8 w-12 ${flip ? "lg:left-auto lg:right-0 lg:-scale-x-100" : ""}`}
		>
			<path d="M2 30C6 12 22 2 46 2 42 20 26 30 2 30Z" fill="var(--color-sprout)" />
		</svg>
	);
}

export function HowItWorksSection() {
	return (
		<section id="how-it-works" className="overflow-hidden bg-moss py-24 text-paper lg:py-40">
			<div className="mx-auto max-w-[88rem] px-4 sm:px-8">
				<div className="mb-20 grid gap-8 lg:mb-28 lg:grid-cols-12">
					<p className="text-sm font-semibold text-sprout lg:col-span-3">Como funciona</p>
					<h2 data-reveal="lines" className="display text-[clamp(2.75rem,6vw,5.5rem)] lg:col-span-9">
						Do vaso vazio à lista de compras em três passos.
					</h2>
				</div>

				<div className="relative">
					{/* stem */}
					<div className="absolute bottom-0 left-6 top-0 w-[3px] rounded-full bg-paper/10 lg:left-1/2 lg:-translate-x-1/2">
						<div data-grow className="h-full w-full rounded-full bg-sprout" />
					</div>

					<ol className="space-y-24 lg:space-y-40">
						{steps.map((step, i) => {
							const right = i % 2 === 1;
							return (
								<li key={step.title} className="relative grid pl-16 lg:grid-cols-2 lg:pl-0">
									<div className="absolute left-6 top-0 lg:left-1/2">
										<Leaf flip={right} />
									</div>
									<div
										data-reveal="up"
										className={right ? "lg:col-start-2 lg:pl-20" : "lg:pr-20 lg:text-right"}
									>
										<span className="font-display text-[clamp(4rem,9vw,8rem)] font-extrabold leading-none tracking-tighter text-sprout tabular-nums">
											{i + 1}
										</span>
										<h3 className="mt-4 text-3xl sm:text-4xl">{step.title}</h3>
										<p
											className={`mt-4 max-w-[36ch] text-lg leading-relaxed text-paper/75 ${right ? "" : "lg:ml-auto"}`}
										>
											{step.description}
										</p>
									</div>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</section>
	);
}
