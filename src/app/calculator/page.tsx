import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CalculatorPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Calculadora de custos</h1>
            <p className="mt-2 text-gray-600">
                Selecione as plantas e quantidades.
            </p>

            <Card className="mt-6 p-6">
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">
                                Planta
                            </label>
                            <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                <option>Selecione</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Quantidade
                            </label>
                            <input
                                type="number"
                                min={1}
                                defaultValue={1}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <Button variant="secondary">Adicionar planta</Button>
                    <div>
                        <Button>Calcular custos</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
