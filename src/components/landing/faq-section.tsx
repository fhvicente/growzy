"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
	{
		question: "Funciona para hortas em varanda?",
		answer: "Sim. Serve para qualquer espaço, de um parapeito a um quintal. Dizes as medidas, a luz e o que queres plantar, e a Growzy calcula o resto.",
	},
	{
		question: "De onde vêm os preços das plantas?",
		answer: "São estimativas de referência e a app mostra o mês em que foram verificadas. Confirma sempre na loja: se o preço for outro, a conta continua a dar-te uma boa ideia.",
	},
	{
		question: "Como cancelo a subscrição?",
		answer: "Não há fidelização: o Standard é mensal ou anual e não ficas preso a nada.",
	},
	{
		question: "As plantas são as que se cultivam cá?",
		answer: "Sim. A base foca-se em plantas comuns em Portugal e adequadas ao nosso clima.",
	},
	{
		question: "Há aplicação para telemóvel?",
		answer: "A Growzy é uma aplicação web pensada para o telemóvel. Abre no browser e funciona como uma app.",
	},
];

export function FAQSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section id="faq" className="bg-paper-2 py-24 lg:py-40">
			<div className="mx-auto grid max-w-[88rem] gap-12 px-4 sm:px-8 lg:grid-cols-12">
				<h2 data-reveal="lines" className="display text-[clamp(2.75rem,6vw,5.5rem)] text-ink lg:col-span-4">
					Perguntas que nos fazem.
				</h2>

				<div className="lg:col-span-7 lg:col-start-6">
					{faqs.map((faq, index) => {
						const open = openIndex === index;
						return (
							<div key={faq.question} className="border-t border-ink/15 last:border-b">
								<button
									type="button"
									onClick={() => setOpenIndex(open ? null : index)}
									className="group flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left"
									aria-expanded={open}
								>
									<span className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
										{faq.question}
									</span>
									<span
										className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-[background-color,color,rotate] duration-300 ease-(--ease-out-expo) ${open ? "rotate-45 bg-ink text-paper" : "group-hover:bg-ink/5"}`}
									>
										<Plus className="h-5 w-5" />
									</span>
								</button>
								<div
									className={`grid transition-[grid-template-rows] duration-500 ease-(--ease-out-expo) ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
								>
									<div className="overflow-hidden">
										<p className="max-w-[60ch] pb-8 text-lg leading-relaxed text-ink-soft">
											{faq.answer}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
