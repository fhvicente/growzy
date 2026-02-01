import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
	const plans = [
		{
			name: "Grátis",
			price: "€0",
			period: "sempre grátis",
			description: "Perfeito para começar",
			features: [
				"Até 3 cálculos por mês",
				"Acesso à calculadora básica",
				"Plantas básicas disponíveis",
				"Suporte por email",
			],
			cta: "Começar grátis",
			href: "/register",
			highlighted: false,
			icon: Zap,
		},
		{
			name: "Premium",
			price: "€2.99",
			period: "por mês",
			description: "Para entusiastas sérios",
			badge: "Mais Popular",
			features: [
				"Cálculos ilimitados",
				"Calculadora avançada",
				"Todas as plantas disponíveis",
				"Estimativas de economia personalizadas",
				"Salvamento ilimitado de projetos",
				"Suporte prioritário",
				"Acesso a novas funcionalidades",
			],
			cta: "Começar Premium",
			href: "/api/subscription/checkout",
			highlighted: true,
			icon: Crown,
		},
	];

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-primary-50/20">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center">
					<Badge variant="outline" className="mb-4 border-primary-200 bg-primary-50">
						<Sparkles className="mr-1 h-3 w-3" />
						Planos e Preços
					</Badge>
					<h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
						Escolha o plano perfeito para si
					</h1>
					<p className="mt-4 text-lg text-muted-foreground">
						Desbloqueie o potencial total da sua mini horta com funcionalidades avançadas
					</p>
				</div>

				{/* Pricing Cards */}
				<div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
					{plans.map((plan) => (
						<Card
							key={plan.name}
							className={`relative border-2 transition-all ${
								plan.highlighted
									? "scale-105 border-primary-500 shadow-2xl"
									: "border-gray-200 hover:border-primary-200 hover:shadow-lg"
							}`}
						>
							{plan.highlighted && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2">
									<Badge className="bg-primary-600 px-4 py-1 text-white">
										<Star className="mr-1 h-3 w-3" />
										{plan.badge}
									</Badge>
								</div>
							)}

							<CardHeader
								className={plan.highlighted ? "bg-linear-to-br from-primary-50 to-primary-100/50" : ""}
							>
								<div className="flex items-center gap-3">
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-lg ${
											plan.highlighted ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"
										}`}
									>
										<plan.icon className="h-6 w-6" />
									</div>
									<div>
										<CardTitle className="text-2xl">{plan.name}</CardTitle>
										<CardDescription>{plan.description}</CardDescription>
									</div>
								</div>
								<div className="mt-6">
									<div className="flex items-baseline gap-2">
										<span className="text-5xl font-bold tracking-tight text-gray-900">
											{plan.price}
										</span>
										<span className="text-lg text-muted-foreground">{plan.period}</span>
									</div>
								</div>
							</CardHeader>

							<CardContent className="pt-6">
								<ul className="space-y-3">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-start gap-3">
											<Check
												className={`mt-0.5 h-5 w-5 shrink-0 ${
													plan.highlighted ? "text-primary-600" : "text-gray-400"
												}`}
											/>
											<span className="text-sm text-gray-700">{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>

							<CardFooter>
								<Link href={plan.href} className="w-full">
									<Button
										size="lg"
										className={`group w-full gap-2 ${plan.highlighted ? "" : "variant-outline"}`}
										variant={plan.highlighted ? "primary" : "outline"}
									>
										{plan.cta}
										<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
									</Button>
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>

				{/* FAQ/Benefits Section */}
				<div className="mt-20">
					<div className="text-center">
						<h2 className="text-3xl font-bold text-gray-900">Porquê escolher Premium?</h2>
						<p className="mt-2 text-muted-foreground">Benefícios exclusivos para maximizar o seu sucesso</p>
					</div>

					<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						<Card className="border-2">
							<CardHeader>
								<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
									<Sparkles className="h-5 w-5" />
								</div>
								<CardTitle className="text-lg">Sem Limites</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Crie quantos projetos quiser, sem restrições mensais.
								</p>
							</CardContent>
						</Card>

						<Card className="border-2">
							<CardHeader>
								<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
									<Zap className="h-5 w-5" />
								</div>
								<CardTitle className="text-lg">Funcionalidades Avançadas</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Acesso a todas as plantas e ferramentas de cálculo avançadas.
								</p>
							</CardContent>
						</Card>

						<Card className="border-2">
							<CardHeader>
								<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
									<Crown className="h-5 w-5" />
								</div>
								<CardTitle className="text-lg">Suporte Prioritário</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Respostas rápidas e ajuda dedicada quando precisar.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* CTA Section */}
				<div className="mt-20 rounded-2xl bg-linear-to-br from-primary-600 to-primary-800 p-8 text-center text-white lg:p-12">
					<h2 className="text-3xl font-bold">Ainda tem dúvidas?</h2>
					<p className="mt-4 text-primary-100">
						Experimente grátis e veja como podemos ajudar a sua horta a prosperar
					</p>
					<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Link href="/register">
							<Button
								size="lg"
								variant="secondary"
								className="bg-white text-primary-700 hover:bg-primary-50"
							>
								Começar grátis
							</Button>
						</Link>
						<Link href="/contact">
							<Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
								Contactar-nos
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
