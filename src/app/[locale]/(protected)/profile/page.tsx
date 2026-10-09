import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CheckoutButton } from "@/components/pricing/checkout-button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";
import { NameForm, PasswordForm } from "./profile-forms";

interface ProfilePageProps {
	params: Promise<{ locale: string }>;
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
	return (
		<section className="grid gap-6 border-t border-line py-10 md:grid-cols-[14rem_1fr]">
			<div>
				<h2 className="font-display text-xl font-bold text-ink">{title}</h2>
				<p className="mt-1 text-sm text-ink-soft">{hint}</p>
			</div>
			<div className="max-w-md">{children}</div>
		</section>
	);
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	const [plan, [{ total }]] = await Promise.all([
		getUserPlan(session.user.id),
		db.select({ total: count() }).from(gardens).where(eq(gardens.userId, session.user.id)),
	]);
	const { displayName, maxHortas } = getPlanFeatures(plan);

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
			<p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Conta</p>
			<h1 className="display mt-1 mb-8 text-5xl text-ink">Perfil</h1>

			<Section title="Perfil" hint="Como te tratamos.">
				<NameForm name={session.user.name ?? ""} email={session.user.email} />
			</Section>

			<Section title="Palavra-passe" hint="Ao alterar, as outras sessões abertas terminam.">
				<PasswordForm />
			</Section>

			<Section title="Plano" hint="O que pagas.">
				<div className="rounded-2xl bg-moss-deep p-7 text-paper">
					<p className="text-xs font-semibold uppercase tracking-widest text-paper/70">Plano atual</p>
					<p className="display mt-2 text-4xl">{displayName}</p>
					<p className="mt-2 text-sm text-paper/80">
						{maxHortas === -1
							? `${total} hortas guardadas, sem limite.`
							: `${total} de ${maxHortas} hortas guardadas. O Standard não tem limite e mostra o ano todo.`}
					</p>
					{plan === "free" && (
						<div className="mt-5 max-w-xs">
							<CheckoutButton plan="standard" label="Passar para Standard" className="bg-sprout text-ink hover:bg-sprout/85" />
						</div>
					)}
				</div>
			</Section>
		</div>
	);
}
