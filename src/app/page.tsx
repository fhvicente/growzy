import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Calculator, TrendingDown, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function HomePage() {
	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-linear-to-br from-primary-50 via-white to-primary-100 py-20 lg:py-28">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary-100),transparent)]" />
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid items-center gap-12 lg:grid-cols-2">
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
							<p className="mt-6 text-balance text-lg leading-8 text-gray-600">
								Calcule custos com precisão, acompanhe o seu plantio e cultive alimentos saudáveis em
								casa. Transforme o seu espaço num jardim produtivo.
							</p>
							<div className="mt-8 flex flex-col gap-4 sm:flex-row">
								<Link href="/calculator" className="cursor-pointer">
									<Button size="lg" className="group w-full sm:w-auto">
										Começar agora
										<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
									</Button>
								</Link>
								<Link href="/pricing">
									<Button variant="outline" size="lg" className="w-full sm:w-auto">
										Ver planos
									</Button>
								</Link>
							</div>
							<div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-primary-600" />
									<span>Sem cartão necessário</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-primary-600" />
									<span>Teste grátis</span>
								</div>
							</div>
						</div>
						<div className="relative lg:mt-0">
							<div className="relative h-100 lg:h-125">
								<div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary-200 to-primary-300 opacity-20 blur-3xl" />
								<Card className="relative h-full border-2 border-primary-200 bg-linear-to-br from-white to-primary-50 shadow-2xl">
									<CardContent className="flex h-full items-center justify-center p-12">
										<div className="space-y-6 text-center">
											<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-100">
												<Leaf className="h-12 w-12 text-primary-600" />
											</div>
											<h3 className="text-2xl font-bold text-gray-900">Horta Inteligente</h3>
											<p className="text-gray-600">Sistema de planeamento avançado</p>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-white py-20 lg:py-28">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<Badge variant="outline" className="mb-4">
							Funcionalidades
						</Badge>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
							Tudo o que precisa para começar
						</h2>
						<p className="mt-4 text-lg text-gray-600">
							Ferramentas poderosas para planear e gerir a sua horta
						</p>
					</div>

					<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						<Card className="group border-2 transition-all hover:border-primary-200 hover:shadow-lg">
							<CardHeader>
								<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-transform group-hover:scale-110">
									<Calculator className="h-7 w-7" />
								</div>
								<CardTitle>Planeamento Preciso</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Calcule todos os custos envolvidos na montagem da sua mini horta com precisão
									profissional.
								</p>
							</CardContent>
						</Card>

						<Card className="group border-2 transition-all hover:border-primary-200 hover:shadow-lg">
							<CardHeader>
								<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-transform group-hover:scale-110">
									<TrendingDown className="h-7 w-7" />
								</div>
								<CardTitle>Poupança Garantida</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Evite gastos desnecessários e planeie exatamente o que precisa para o seu projeto.
								</p>
							</CardContent>
						</Card>

						<Card className="group border-2 transition-all hover:border-primary-200 hover:shadow-lg">
							<CardHeader>
								<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-transform group-hover:scale-110">
									<Leaf className="h-7 w-7" />
								</div>
								<CardTitle>Personalização Total</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Escolha entre diversas plantas e adapte o seu projeto às suas necessidades.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-linear-to-br from-primary-600 to-primary-800 py-20">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
						Pronto para começar a sua horta?
					</h2>
					<p className="mt-4 text-lg text-primary-100">
						Junte-se a milhares de utilizadores que já transformaram os seus espaços em hortas produtivas.
					</p>
					<div className="mt-8">
						<Link href="/register" className="cursor-pointer">
							<Button
								size="lg"
								variant="secondary"
								className="bg-white text-primary-700 hover:bg-primary-50"
							>
								Criar conta grátis
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
