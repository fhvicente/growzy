import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calculator, TrendingUp, Leaf, Plus, ArrowUpRight, CalendarDays } from "lucide-react";

interface DashboardPageProps {
	params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	// Mock data - replace with actual data from your database
	const stats = [
		{
			title: "Total de Cálculos",
			value: "12",
			change: "+2 este mês",
			icon: Calculator,
			color: "text-blue-600 bg-blue-100",
		},
		{
			title: "Economia Total",
			value: "€156",
			change: "+€23 este mês",
			icon: TrendingUp,
			color: "text-green-600 bg-green-100",
		},
		{
			title: "Plantas Favoritas",
			value: "8",
			change: "Tomate, Alface",
			icon: Leaf,
			color: "text-primary-600 bg-primary-100",
		},
	];

	const recentCalculations = [
		{
			id: 1,
			name: "Horta Varanda",
			date: "2 dias atrás",
			plants: 5,
			cost: "€45",
		},
		{
			id: 2,
			name: "Jardim Traseiro",
			date: "1 semana atrás",
			plants: 12,
			cost: "€89",
		},
		{
			id: 3,
			name: "Pequena Horta",
			date: "2 semanas atrás",
			plants: 3,
			cost: "€22",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="mt-2 text-muted-foreground">
						Bem-vindo de volta! Aqui está um resumo da sua atividade.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{stats.map((stat) => (
						<Card key={stat.title} className="border-2 transition-all hover:shadow-lg">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{stat.title}
								</CardTitle>
								<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
									<stat.icon className="h-5 w-5" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Quick Actions */}
				<Card className="mb-8 border-2 border-primary-200 bg-linear-to-br from-primary-50 to-white">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Plus className="h-5 w-5" />
							Ações Rápidas
						</CardTitle>
						<CardDescription>Comece um novo projeto ou explore funcionalidades</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						<Link href={`/${locale}/calculator`}>
							<Button className="gap-2">
								<Calculator className="h-4 w-4" />
								Novo Cálculo
							</Button>
						</Link>
						<Link href={`/${locale}/pricing`}>
							<Button variant="outline" className="gap-2">
								<ArrowUpRight className="h-4 w-4" />
								Ver Planos Premium
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Recent Calculations */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Cálculos Recentes</CardTitle>
								<CardDescription>Os seus projetos mais recentes</CardDescription>
							</div>
							<Link href={`/${locale}/calculator`} className="cursor-pointer">
								<Button variant="outline" size="sm">
									Ver todos
								</Button>
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentCalculations.map((calc) => (
								<div
									key={calc.id}
									className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-gray-50"
								>
									<div className="flex items-center gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
											<Leaf className="h-6 w-6 text-primary-600" />
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">{calc.name}</h3>
											<div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
												<span className="flex items-center gap-1">
													<CalendarDays className="h-3 w-3" />
													{calc.date}
												</span>
												<Badge variant="secondary" className="text-xs">
													{calc.plants} plantas
												</Badge>
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-lg font-bold text-gray-900">{calc.cost}</div>
										<Link href={`/calculator/result/${calc.id}`} className="cursor-pointer">
											<Button variant="ghost" size="sm" className="mt-1">
												Ver detalhes
											</Button>
										</Link>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
