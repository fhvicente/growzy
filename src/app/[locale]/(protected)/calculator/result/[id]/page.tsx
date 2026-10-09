import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { GardenResultClient } from "@/components/garden/garden-result-client";
import { auth } from "@/lib/auth";
import { gardenView, getUserGarden } from "@/lib/garden-view";

interface GardenResultPageProps {
	params: Promise<{ locale: string; id: string }>;
}

export default async function GardenResultPage({ params }: GardenResultPageProps) {
	const { locale, id } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	const garden = await getUserGarden(id, session.user.id);
	if (!garden) notFound();

	const { view, month } = await gardenView(garden.input, session.user.id);
	return (
		<GardenResultClient
			locale={locale}
			garden={{ id: garden.id, name: garden.name, input: garden.input }}
			view={view}
			month={month}
		/>
	);
}
