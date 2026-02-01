import { Card } from "@/components/ui/card";

export default function CalculatorResultPage() {
	return (
		<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold">Resultado do cálculo</h1>
			<Card className="mt-6 p-6">
				<p className="text-gray-600">Detalhamento de custos será renderizado aqui.</p>
			</Card>
		</div>
	);
}
