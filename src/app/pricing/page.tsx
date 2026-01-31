import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">Planos de Assinatura</h1>
            <p className="mt-2 text-gray-600">
                Desbloqueie a calculadora avançada e salvamento ilimitado.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold">
                        Horta Fácil Premium
                    </h2>
                    <p className="mt-2 text-gray-600">€ 2,99 / mês</p>
                    <ul className="mt-4 list-disc space-y-1 pl-4 text-sm text-gray-600">
                        <li>Acesso à calculadora avançada</li>
                        <li>Estimativas de economia personalizadas</li>
                        <li>Salvamento ilimitado de cálculos</li>
                    </ul>
                    <div className="mt-6">
                        <Button>Subscrever</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
