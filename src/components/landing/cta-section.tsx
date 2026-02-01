import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, CheckCircle2 } from "lucide-react";

interface CTASectionProps {
	locale: string;
}

export function CTASection({ locale }: CTASectionProps) {
	return (
		<section className="relative overflow-hidden bg-linear-to-br from-primary-600 to-primary-500 py-20 lg:py-24">
			{/* Background decoration */}
			<div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10" />

			<div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
				{/* Icon */}
				<div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
					<Leaf className="h-10 w-10 text-white" />
				</div>

				{/* Headline */}
				<h2 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl">
					Comece a Cultivar a Sua Horta Hoje
				</h2>

				{/* Subheadline */}
				<p className="mb-8 text-lg text-white/90 lg:text-xl">
					Junte-se a milhares de pessoas que já cultivam alimentos saudáveis em casa
				</p>

				{/* CTA Button */}
				<Link href={`/${locale}/calculator`}>
					<Button size="lg" className="group mb-6 bg-white text-primary-600 hover:bg-gray-50">
						Começar Gratuitamente
						<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Button>
				</Link>

				{/* Trust Indicators */}
				<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-5 w-5" />
						<span>Teste grátis 14 dias</span>
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-5 w-5" />
						<span>Sem cartão necessário</span>
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-5 w-5" />
						<span>Cancele quando quiser</span>
					</div>
				</div>
			</div>
		</section>
	);
}
