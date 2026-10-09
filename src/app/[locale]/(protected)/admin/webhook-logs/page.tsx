import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/lib/db";
import { webhookLogs } from "@/lib/schema";
import { ReprocessButton } from "./reprocess-button";

const STATUSES = ["error", "processing", "success"];

export default async function WebhookLogsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
	const { status } = await searchParams;
	const filter = status && STATUSES.includes(status) ? status : undefined;
	// ponytail: últimos 100, sem paginação; acrescentar se o volume crescer.
	const rows = await db
		.select()
		.from(webhookLogs)
		.where(filter ? eq(webhookLogs.status, filter) : undefined)
		.orderBy(desc(webhookLogs.createdAt))
		.limit(100);

	return (
		<div>
			<h1 className="text-2xl font-bold">Webhooks do Stripe</h1>
			<nav className="mt-4 flex gap-3 text-sm">
				{[undefined, ...STATUSES].map((s) => (
					<Link
						key={s ?? "all"}
						href={s ? `?status=${s}` : "?"}
						aria-current={s === filter ? "page" : undefined}
						className="rounded-full px-3 py-1 hover:bg-paper-2 aria-[current=page]:bg-moss aria-[current=page]:text-paper"
					>
						{s ?? "todos"}
					</Link>
				))}
			</nav>
			<table className="mt-6 w-full text-left text-sm">
				<thead className="border-b border-line text-ink-soft">
					<tr>
						<th className="py-2">Quando</th>
						<th>Evento</th>
						<th>Estado</th>
						<th>Detalhe</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{rows.map((l) => (
						<tr key={l.id} className="border-b border-line/60 align-top">
							<td className="py-2 whitespace-nowrap">{l.createdAt.toLocaleString("pt-PT")}</td>
							<td>
								{l.eventType}
								{l.eventId && <div className="font-mono text-xs text-ink-soft">{l.eventId}</div>}
							</td>
							<td className={l.status === "error" ? "font-semibold text-destructive" : undefined}>
								{l.status}
							</td>
							<td className="max-w-md">
								{l.errorMessage && <p className="text-destructive">{l.errorMessage}</p>}
								{l.payload && (
									<details>
										<summary className="cursor-pointer text-ink-soft">payload</summary>
										<pre className="max-h-64 overflow-auto text-xs">{l.payload}</pre>
									</details>
								)}
							</td>
							<td>{l.payload && l.status !== "success" && <ReprocessButton id={l.id} />}</td>
						</tr>
					))}
				</tbody>
			</table>
			{rows.length === 0 && <p className="mt-4 text-ink-soft">Sem eventos.</p>}
		</div>
	);
}
