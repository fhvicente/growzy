import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auditLogs, gardens, subscriptions, users } from "@/lib/schema";
import { UserActions } from "./user-actions";

const date = (d: Date | null) => (d ? d.toLocaleString("pt-PT") : "—");

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
	if (!user) notFound();

	const [subs, hortas, log] = await Promise.all([
		db.select().from(subscriptions).where(eq(subscriptions.userId, id)).orderBy(desc(subscriptions.createdAt)),
		db
			.select({ id: gardens.id, name: gardens.name, createdAt: gardens.createdAt, updatedAt: gardens.updatedAt })
			.from(gardens)
			.where(eq(gardens.userId, id))
			.orderBy(desc(gardens.updatedAt)),
		db.select().from(auditLogs).where(eq(auditLogs.targetId, id)).orderBy(desc(auditLogs.createdAt)).limit(20),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">{user.email}</h1>
				<p className="text-ink-soft">
					{user.name} · registo {date(user.createdAt)} · email{" "}
					{user.emailVerified ? "verificado" : "por verificar"}
				</p>
			</div>

			<Card className="space-y-4 p-6">
				<p>
					Plano <strong>{user.subscriptionPlan}</strong> · estado{" "}
					<strong>{user.subscriptionStatus ?? "—"}</strong> · Stripe{" "}
					<code>{user.stripeId ?? "sem cliente"}</code>
				</p>
				{user.stripeId && (
					<p className="text-sm text-ink-soft">
						Mudar o plano à mão pode ser desfeito pelo próximo webhook do Stripe.
					</p>
				)}
				<UserActions id={user.id} email={user.email} plan={user.subscriptionPlan} hasStripe={!!user.stripeId} />
			</Card>

			<section>
				<h2 className="font-semibold">Subscrições</h2>
				{subs.length === 0 ? (
					<p className="text-sm text-ink-soft">Nenhuma.</p>
				) : (
					<ul className="mt-2 text-sm">
						{subs.map((s) => (
							<li key={s.id}>
								<code>{s.stripeId}</code> · {s.plan} · {s.stripeStatus} · desde {date(s.createdAt)}
								{s.endsAt && ` · terminou ${date(s.endsAt)}`}
							</li>
						))}
					</ul>
				)}
			</section>

			<section>
				<h2 className="font-semibold">Hortas ({hortas.length})</h2>
				<ul className="mt-2 text-sm">
					{hortas.map((g) => (
						<li key={g.id}>
							{g.name} · criada {date(g.createdAt)} · alterada {date(g.updatedAt)}
						</li>
					))}
				</ul>
			</section>

			<section>
				<h2 className="font-semibold">Auditoria</h2>
				<ul className="mt-2 text-sm">
					{log.map((l) => (
						<li key={l.id}>
							{date(l.createdAt)} · {l.action} {l.details ? JSON.stringify(l.details) : ""}
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
