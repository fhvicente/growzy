import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CalculatorClient } from "@/components/calculator/calculator-client";
import { auth } from "@/lib/auth";
import { getUserGarden } from "@/lib/garden-view";

interface CalculatorPageProps {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ garden?: string }>;
}

export default async function CalculatorPage({ params, searchParams }: CalculatorPageProps) {
	const { locale } = await params;
	const { garden: gardenId } = await searchParams;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	const garden = gardenId ? await getUserGarden(gardenId, session.user.id) : null;
	if (gardenId && !garden) notFound();

	return (
		<CalculatorClient
			locale={locale}
			garden={garden ? { id: garden.id, name: garden.name, input: garden.input } : undefined}
		/>
	);
}
