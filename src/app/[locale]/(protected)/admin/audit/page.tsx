import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/schema";

export default async function AdminAuditPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	// O email do autor é de um admin, não de um cliente; o alvo fica só pelo id.
	const rows = await db
		.select({ log: auditLogs, actor: users.email })
		.from(auditLogs)
		.leftJoin(users, eq(users.id, auditLogs.actorId))
		.orderBy(desc(auditLogs.createdAt))
		.limit(200);

	return (
		<div>
			<h1 className="text-2xl font-bold">Auditoria</h1>
			<table className="mt-6 w-full text-left text-sm">
				<thead className="border-b border-line text-ink-soft">
					<tr>
						<th className="py-2">Quando</th>
						<th>Admin</th>
						<th>Ação</th>
						<th>Utilizador</th>
						<th>Detalhes</th>
					</tr>
				</thead>
				<tbody>
					{rows.map(({ log, actor }) => (
						<tr key={log.id} className="border-b border-line/60">
							<td className="py-2">{log.createdAt.toLocaleString("pt-PT")}</td>
							<td>{actor ?? log.actorId}</td>
							<td>{log.action}</td>
							<td>
								{log.targetId && (
									<Link
										href={`/${locale}/admin/users/${log.targetId}`}
										className="font-mono text-xs hover:underline"
									>
										{log.targetId}
									</Link>
								)}
							</td>
							<td className="font-mono text-xs">{log.details ? JSON.stringify(log.details) : ""}</td>
						</tr>
					))}
				</tbody>
			</table>
			{rows.length === 0 && <p className="mt-4 text-ink-soft">Ainda sem registos.</p>}
		</div>
	);
}
