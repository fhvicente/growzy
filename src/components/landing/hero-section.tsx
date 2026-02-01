import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, Calculator, TrendingDown } from "lucide-react";

interface HeroSectionProps {
	locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
	return (
		<section
			id="hero"
			className="relative overflow-hidden bg-linear-to-br from-primary-50 via-white to-primary-100 pb-20 pt-32 lg:pb-28 lg:pt-40"
		>
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary-100),transparent)]" />

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					{/* Column 1: Content */}
					<div className="animate-fade-in">
						<Badge className="mb-4 bg-primary-600 hover:bg-primary-700">
							<Sparkles className="mr-1 h-3 w-3" />
							Ferramenta Premium para Hortas
						</Badge>

						<h1 className="text-balance text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl">
							Planeie a sua{" "}
							<span className="bg-linear-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
								Mini Horta
							</span>{" "}
							com precisão
						</h1>

						<p className="mt-6 text-balance text-lg leading-8 text-muted-foreground">
							Calcule custos com precisão, acompanhe o seu plantio e cultive alimentos saudáveis em casa.
							A ferramenta completa para horticultores urbanos.
						</p>

						{/* CTA Buttons */}
						<div className="mt-8 flex flex-col gap-4 sm:flex-row">
							<Link href={`/${locale}/calculator`} className="cursor-pointer">
								<Button size="lg" className="group w-full sm:w-auto">
									Começar Agora
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Button>
							</Link>
							<Link href={`/${locale}/pricing`}>
								<Button variant="outline" size="lg" className="w-full sm:w-auto">
									Ver Planos
								</Button>
							</Link>
						</div>

						{/* Trust Indicators */}
						<div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-primary-600" />
								<span>Sem cartão necessário</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-primary-600" />
								<span>Teste grátis 14 dias</span>
							</div>
						</div>
					</div>

					{/* Column 2: Calculator Preview Card */}
					<div className="relative">
						<div className="absolute inset-0 -z-10 bg-linear-to-tr from-primary-400/20 to-primary-600/20 blur-3xl" />
						<Card className="border-2 border-primary-200 bg-white/80 shadow-2xl backdrop-blur">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calculator className="h-5 w-5 text-primary-600" />
									Exemplo de Cálculo
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">5x Tomates</span>
										<span className="font-semibold">€12.50</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">3x Alface</span>
										<span className="font-semibold">€4.50</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">2x Manjericão</span>
										<span className="font-semibold">€3.60</span>
									</div>
								</div>
								<div className="border-t pt-4">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-gray-900">Custo Total</span>
										<span className="text-2xl font-bold text-primary-600">€20.60</span>
									</div>
								</div>
								<div className="rounded-lg bg-green-50 p-3">
									<div className="flex items-center gap-2">
										<TrendingDown className="h-4 w-4 text-green-600" />
										<span className="text-sm font-medium text-green-900">
											Economia de 45% vs. supermercado
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}
