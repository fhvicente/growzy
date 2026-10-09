import { and, count, countDistinct, eq, gte, sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/lib/db";
import { gardens, users, webhookLogs } from "@/lib/schema";

const daysAgo = (n: number) => new Date(Date.now() - n * 864e5);
const paying = sql`${users.subscriptionStatus} in ('active', 'trialing')`;

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const since30 = daysAgo(30);

	const [[u], [g], [w]] = await Promise.all([
		db
			.select({
				total: count(),
				new30: count(sql`case when ${users.createdAt} >= ${since30} then 1 end`),
				paying: count(sql`case when ${paying} then 1 end`),
				standard: count(sql`case when ${paying} and ${users.subscriptionPlan} = 'standard' then 1 end`),
				premium: count(sql`case when ${paying} and ${users.subscriptionPlan} = 'premium' then 1 end`),
				pastDue: count(sql`case when ${users.subscriptionStatus} = 'past_due' then 1 end`),
			})
			.from(users),
		db
			.select({
				total: count(),
				new30: count(sql`case when ${gardens.createdAt} >= ${since30} then 1 end`),
				owners: countDistinct(gardens.userId),
			})
			.from(gardens),
		db
			.select({ failed: count() })
			.from(webhookLogs)
			.where(and(eq(webhookLogs.status, "error"), gte(webhookLogs.createdAt, daysAgo(7)))),
	]);

	const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");
	const kpis: [string, string | number, string?, string?][] = [
		["Utilizadores", u.total, `+${u.new30} nos últimos 30 dias`, "users"],
		["Subscritores ativos", u.paying, `${u.standard} Standard · ${u.premium} Premium`],
		["Conversão", pct(u.paying, u.total), "utilizadores com plano pago"],
		["Pagamentos em atraso", u.pastDue, "estado past_due", "users"],
		["Hortas guardadas", g.total, `+${g.new30} nos últimos 30 dias`],
		["Ativação", pct(g.owners, u.total), `${g.owners} utilizadores com pelo menos 1 horta`],
		["Webhooks falhados", w.failed, "últimos 7 dias", "webhook-logs"],
	];

	return (
		<div>
			<h1 className="text-2xl font-bold">Visão geral</h1>
			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{kpis.map(([label, value, hint, href]) => {
					const card = (
						<div className="h-full rounded-lg border border-line p-4">
							<p className="text-sm text-ink-soft">{label}</p>
							<p className="mt-1 text-3xl font-bold text-ink">{value}</p>
							{hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
						</div>
					);
					return href ? (
						<Link key={label} href={`/${locale}/admin/${href}`} className="hover:opacity-80">
							{card}
						</Link>
					) : (
						<div key={label}>{card}</div>
					);
				})}
			</div>
		</div>
	);
}
