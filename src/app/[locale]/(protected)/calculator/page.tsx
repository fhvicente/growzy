import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CalculatorClient } from "@/components/calculator/calculator-client";

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

	return <CalculatorClient plants={plants} />;
}
