"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./reveal";

const faqs = [
	{
		question: "A Mini Horta funciona para hortas em varanda?",
		answer: "Sim! A calculadora adapta-se a qualquer espaço, desde varandas pequenas a quintais grandes. Pode definir o espaço disponível e receber sugestões adequadas.",
	},
	{
		question: "Os preços das plantas são atualizados?",
		answer: "Os preços são baseados em médias do mercado português e são atualizados regularmente. Pode também personalizar preços se encontrar valores diferentes.",
	},
	{
		question: "Posso usar sem internet?",
		answer: "A aplicação funciona offline para consultar os seus dados. Precisa de internet para sincronizar entre dispositivos e aceder à base de dados completa.",
	},
	{
		question: "Como cancelo a subscrição?",
		answer: "Pode cancelar a qualquer momento nas definições da conta. Não há períodos de fidelização.",
	},
	{
		question: "Há garantia de devolução?",
		answer: "Sim! Teste grátis durante 14 dias. Se não ficar satisfeito, devolvemos 100% do valor.",
	},
	{
		question: "A base de dados inclui plantas portuguesas?",
		answer: "Sim! Focamo-nos em plantas comuns em Portugal e adequadas ao clima português.",
	},
	{
		question: "Posso exportar os meus dados?",
		answer: "Sim! Utilizadores Pro podem exportar relatórios em PDF e Excel.",
	},
	{
		question: "Há aplicação móvel?",
		answer: "Atualmente é uma aplicação web responsiva que funciona perfeitamente em qualquer dispositivo.",
	},
];

export function FAQSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section id="faq" className="bg-gray-50 py-20 lg:py-24">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<Reveal direction="up">
					<div className="text-center">
						<p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-600">FAQ</p>
						<h2 className="mb-12 text-4xl font-bold tracking-tight text-gray-900 lg:mb-16 lg:text-5xl">
							Perguntas Frequentes
						</h2>
					</div>
				</Reveal>

				{/* FAQ Accordion */}
				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<Reveal key={index} delay={index * 50} direction="up">
							<div
								key={index}
								className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
							>
								{/* Question */}
								<button
									onClick={() => toggleFAQ(index)}
									className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-gray-50"
									aria-expanded={openIndex === index}
								>
									<span className="text-base font-semibold text-gray-900 sm:text-lg">
										{faq.question}
									</span>
									<ChevronDown
										className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
											openIndex === index ? "rotate-180" : ""
										}`}
									/>
								</button>

								{/* Answer */}
								<div
									className={`overflow-hidden transition-all duration-200 ${
										openIndex === index ? "max-h-96" : "max-h-0"
									}`}
								>
									<div className="border-t border-gray-100 px-6 pb-6 pt-4">
										<p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
									</div>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
