import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface ProfilePageProps {
	params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold">Perfil</h1>
			<Card className="mt-6 p-6">
				<div className="space-y-4">
					<div>
						<label className="text-sm font-medium">Nome</label>
						<Input defaultValue={session.user.name ?? ""} />
					</div>
					<div>
						<label className="text-sm font-medium">Email</label>
						<Input type="email" defaultValue={session.user.email ?? ""} />
					</div>
					<Button>Guardar</Button>
				</div>
			</Card>
		</div>
	);
}
