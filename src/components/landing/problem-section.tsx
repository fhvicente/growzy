const painPoints = [
	{
		title: "A conta chega no fim",
		description:
			"Vasos, terra, sementes, adubo. Somado à caixa do viveiro, o valor raramente é o que tinhas na cabeça.",
	},
	{
		title: "Não sabes o que cabe",
		description:
			"Quantos tomateiros aguenta uma varanda de 2 m²? Compra-se a mais, ou planta-se tudo junto e nada cresce.",
	},
	{
		title: "Perdes o fio aos gastos",
		description: "Uma compra aqui, outra ali. Ao fim da época ninguém sabe se a horta saiu cara ou barata.",
	},
];

export function ProblemSection() {
	return (
		<section id="problem" className="bg-paper py-24 lg:py-40">
			<div className="mx-auto grid max-w-[88rem] gap-14 px-4 sm:px-8 lg:grid-cols-12 lg:gap-8">
				<div className="lg:col-span-5">
					<div className="lg:sticky lg:top-32">
						<p className="mb-6 text-sm font-semibold text-tomato-deep">Antes da Growzy</p>
						<h2 data-reveal="lines" className="display text-[clamp(2.75rem,6vw,5.5rem)] text-ink">
							Começar uma horta é fácil. Acertar nas contas, nem tanto.
						</h2>
					</div>
				</div>

				<ol className="lg:col-span-6 lg:col-start-7">
					{painPoints.map((point, i) => (
						<li
							key={point.title}
							data-reveal="up"
							className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-ink/15 py-10 sm:grid-cols-[7rem_1fr] lg:py-14"
						>
							<span className="font-display text-5xl font-extrabold tracking-tighter text-moss/25 tabular-nums sm:text-7xl">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div>
								<h3 className="mb-3 text-2xl text-ink sm:text-3xl">{point.title}</h3>
								<p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft">
									{point.description}
								</p>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
