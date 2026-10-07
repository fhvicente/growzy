import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MONTHS, everyLabel } from "@/components/garden/garden-report";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cropBySlug } from "@/lib/garden/catalog";
import { lisbonMonth, planGarden } from "@/lib/garden/plan";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";

interface DashboardPageProps {
	params: Promise<{ locale: string }>;
}

const names = (slugs: string[]) => slugs.map((s) => cropBySlug.get(s)?.name ?? s).join(", ");

export default async function DashboardPage({ params }: DashboardPageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	const [rows, plan] = await Promise.all([
		db.select().from(gardens).where(eq(gardens.userId, session.user.id)).orderBy(desc(gardens.updatedAt)),
		getUserPlan(session.user.id),
	]);
	const { maxHortas } = getPlanFeatures(plan);
	const month = lisbonMonth();
	const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

	// Só o mês atual: é o que todos os planos veem.
	const items = rows.map((g) => {
		const r = planGarden(g.input, month);
		const days = r.watering[month - 1].crops.flatMap((c) => (c.everyDays === null ? [] : [c.everyDays]));
		const todo = r.calendar.months[month - 1];
		const parts = [
			days.length ? `rega ${everyLabel(Math.min(...days))}` : "sem rega",
			todo.sow.length ? `semeia ${names(todo.sow)}` : "",
			todo.transplant.length ? `transplanta ${names(todo.transplant)}` : "",
			todo.harvest.length ? `colhe ${names(todo.harvest)}` : "",
		].filter(Boolean);
		return { id: g.id, name: g.name, total: euro.format(r.shopping.total.mid), summary: parts.join(" · ") };
	});

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="display text-4xl text-ink">As tuas hortas</h1>
					<p className="mt-1 text-ink-soft">
						{maxHortas === -1 ? `${rows.length} guardadas` : `${rows.length} de ${maxHortas} guardadas`} ·{" "}
						{MONTHS[month - 1]}
					</p>
				</div>
				<Link href={`/${locale}/calculator`}>
					<Button>Nova horta</Button>
				</Link>
			</div>

			{items.length === 0 ? (
				<div className="mt-10 rounded-lg border border-dashed border-line p-8 text-center">
					<p className="font-display text-xl font-bold text-ink">Ainda não tens hortas.</p>
					<p className="mt-1 text-ink-soft">Mede o espaço, escolhe o que queres plantar e nós fazemos as contas.</p>
					<Link href={`/${locale}/calculator`} className="mt-4 inline-block">
						<Button variant="tomato">Planeia a tua primeira horta</Button>
					</Link>
				</div>
			) : (
				<ul className="mt-8 divide-y divide-line rounded-lg border border-line bg-card">
					{items.map((g) => (
						<li key={g.id}>
							<Link
								href={`/${locale}/calculator/result/${g.id}`}
								className="flex flex-wrap items-baseline justify-between gap-2 p-4 hover:bg-paper-2"
							>
								<span>
									<span className="font-semibold text-ink">{g.name}</span>
									<span className="block text-sm text-ink-soft">Este mês: {g.summary}</span>
								</span>
								<span className="tabular-nums text-ink">{g.total}</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
