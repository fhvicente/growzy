import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Plus, Trash2, Calculator, Info } from "lucide-react";

interface CalculatorPageProps {
	params: Promise<{ locale: string }>;
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	// Mock plant data - replace with actual data from your database
	const plants = [
		{ id: "tomato", name: "Tomate", price: 2.5 },
		{ id: "lettuce", name: "Alface", price: 1.5 },
		{ id: "basil", name: "Manjericão", price: 1.8 },
		{ id: "pepper", name: "Pimento", price: 2.2 },
		{ id: "cucumber", name: "Pepino", price: 2.0 },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white">
							<Calculator className="h-6 w-6" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Calculadora de Custos</h1>
							<p className="mt-1 text-muted-foreground">Planeie a sua horta e calcule os custos totais</p>
						</div>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Calculator Form */}
					<div className="lg:col-span-2">
						<Card className="border-2">
							<CardHeader>
								<CardTitle>Adicionar Plantas</CardTitle>
								<CardDescription>Selecione as plantas e quantidades para o seu projeto</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Plant Selection */}
								<div className="space-y-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="plant">Planta</Label>
											<Select id="plant" className="w-full">
												<option value="">Selecione uma planta</option>
												{plants.map((plant) => (
													<option key={plant.id} value={plant.id}>
														{plant.name} - €{plant.price}
													</option>
												))}
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="quantity">Quantidade</Label>
											<Input
												id="quantity"
												type="number"
												min={1}
												defaultValue={1}
												placeholder="Ex: 5"
											/>
										</div>
									</div>
									<Button variant="secondary" className="w-full gap-2">
										<Plus className="h-4 w-4" />
										Adicionar à lista
									</Button>
								</div>

								{/* Selected Plants List */}
								<div className="space-y-3">
									<h3 className="flex items-center gap-2 text-sm font-semibold">
										Plantas Selecionadas
										<Badge variant="secondary">0</Badge>
									</h3>
									<div className="rounded-lg border-2 border-gray-200 bg-white p-4">
										<p className="text-center text-sm text-muted-foreground">
											Nenhuma planta adicionada ainda. Selecione plantas acima para começar.
										</p>
									</div>

									{/* Example of how selected plants would look */}
									{/* <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Leaf className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="font-medium">Tomate</p>
                          <p className="text-sm text-muted-foreground">3 unidades × €2.50</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">€7.50</span>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div> */}
								</div>

								{/* Calculate Button */}
								<Button size="lg" className="w-full gap-2">
									<Calculator className="h-5 w-5" />
									Calcular custos totais
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar - Tips & Summary */}
					<div className="space-y-6">
						{/* Quick Summary */}
						<Card className="border-2 border-primary-200 bg-linear-to-br from-primary-50 to-white">
							<CardHeader>
								<CardTitle className="text-lg">Resumo</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Total de plantas:</span>
									<span className="font-semibold">0</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Custo estimado:</span>
									<span className="font-semibold">€0.00</span>
								</div>
								<div className="rounded-lg bg-primary-100 p-3 text-center">
									<p className="text-xs text-primary-700">Adicione plantas para ver o cálculo</p>
								</div>
							</CardContent>
						</Card>

						{/* Tips Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Info className="h-5 w-5 text-primary-600" />
									Dicas
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm text-muted-foreground">
								<div className="rounded-lg bg-blue-50 p-3">
									<p className="font-medium text-blue-900">💡 Comece pequeno</p>
									<p className="mt-1 text-xs text-blue-700">
										Se é a sua primeira horta, comece com 3-5 plantas fáceis de cultivar.
									</p>
								</div>
								<div className="rounded-lg bg-green-50 p-3">
									<p className="font-medium text-green-900">🌱 Plantas populares</p>
									<p className="mt-1 text-xs text-green-700">
										Tomate, alface e manjericão são ótimas escolhas para iniciantes.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
