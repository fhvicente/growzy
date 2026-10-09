import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { gardens, users } from "@/lib/schema";

const PAGE = 50;

export default async function AdminUsersPage({
	params,
	searchParams,
}: {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
	const { locale } = await params;
	const { q = "", page: p, status = "" } = await searchParams;
	const page = Math.max(0, Number(p) || 0);
	const like = `%${q.trim()}%`;

	// Pede-se mais uma linha para saber se há página seguinte.
	const rows = await db
		.select({
			id: users.id,
			email: users.email,
			plan: users.subscriptionPlan,
			status: users.subscriptionStatus,
			createdAt: users.createdAt,
			hortas: count(gardens.id),
		})
		.from(users)
		.leftJoin(gardens, eq(gardens.userId, users.id))
		.where(
			and(
				q.trim() ? or(ilike(users.email, like), ilike(users.name, like)) : undefined,
				status ? eq(users.subscriptionStatus, status) : undefined,
			),
		)
		.groupBy(users.id)
		.orderBy(desc(users.createdAt))
		.limit(PAGE + 1)
		.offset(page * PAGE);
	const hasNext = rows.length > PAGE;
	const qs = (n: number) =>
		`?${new URLSearchParams({ ...(q && { q }), ...(status && { status }), page: String(n) })}`;

	return (
		<div>
			<h1 className="text-2xl font-bold">Utilizadores</h1>
			<form className="mt-4 max-w-sm">
				<Input name="q" defaultValue={q} placeholder="Pesquisar por email ou nome" />
				{status && <input type="hidden" name="status" value={status} />}
			</form>
			{status && (
				<p className="mt-2 text-sm text-ink-soft">
					Só estado <strong>{status}</strong> ·{" "}
					<Link
						href={`/${locale}/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`}
						className="underline"
					>
						limpar
					</Link>
				</p>
			)}
			<table className="mt-6 w-full text-left text-sm">
				<thead className="border-b border-line text-ink-soft">
					<tr>
						<th className="py-2">Email</th>
						<th>Plano</th>
						<th>Estado</th>
						<th>Hortas</th>
						<th>Registo</th>
					</tr>
				</thead>
				<tbody>
					{rows.slice(0, PAGE).map((u) => (
						<tr key={u.id} className="border-b border-line/60">
							<td className="py-2">
								<Link href={`/${locale}/admin/users/${u.id}`} className="font-medium hover:underline">
									{u.email}
								</Link>
							</td>
							<td>{u.plan}</td>
							<td>{u.status}</td>
							<td>{u.hortas}</td>
							<td>{u.createdAt.toLocaleDateString("pt-PT")}</td>
						</tr>
					))}
				</tbody>
			</table>
			{rows.length === 0 && <p className="mt-4 text-ink-soft">Nenhum utilizador encontrado.</p>}
			<div className="mt-4 flex gap-4 text-sm">
				{page > 0 && <Link href={qs(page - 1)}>← Anterior</Link>}
				{hasNext && <Link href={qs(page + 1)}>Seguinte →</Link>}
			</div>
		</div>
	);
}
