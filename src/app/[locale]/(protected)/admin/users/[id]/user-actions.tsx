"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PLAN_FEATURES } from "@/lib/plans";

export function UserActions({
	id,
	email,
	plan,
	hasStripe,
}: {
	id: string;
	email: string;
	plan: string;
	hasStripe: boolean;
}) {
	const router = useRouter();
	const { locale } = useParams<{ locale: string }>();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	async function run(body: Record<string, string>, question?: string) {
		if (question && !confirm(question)) return;
		setBusy(true);
		setError("");
		const res = await fetch(`/api/admin/users/${id}`, { method: "POST", body: JSON.stringify(body) });
		setBusy(false);
		if (!res.ok) return setError((await res.json().catch(() => null))?.error ?? "Falhou");
		if (body.action === "delete") return router.push(`/${locale}/admin/users`);
		router.refresh();
	}

	function remove() {
		const typed = prompt(
			`Apagar a conta, hortas e sessões${hasStripe ? " e cancelar a subscrição no Stripe" : ""}.\nEscreve o email para confirmar:`,
		);
		if (typed?.trim().toLowerCase() !== email.toLowerCase()) return;
		void run({ action: "delete" });
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			<select
				aria-label="Plano"
				className="h-9 rounded-md border border-line bg-paper px-2 text-sm"
				value={plan}
				disabled={busy}
				onChange={(e) => {
					const to = e.target.value;
					if (to !== plan) void run({ action: "set-plan", plan: to }, `Mudar o plano de ${plan} para ${to}?`);
				}}
			>
				{Object.entries(PLAN_FEATURES).map(([type, p]) => (
					<option key={type} value={type}>
						{p.displayName}
					</option>
				))}
			</select>
			{hasStripe && (
				<Button
					size="sm"
					variant="secondary"
					disabled={busy}
					onClick={() => run({ action: "resync" }, "Ir buscar o estado ao Stripe?")}
				>
					Ressincronizar Stripe
				</Button>
			)}
			<Button
				size="sm"
				variant="secondary"
				disabled={busy}
				onClick={() => run({ action: "revoke-sessions" }, "Terminar todas as sessões?")}
			>
				Terminar sessões
			</Button>
			<Button size="sm" variant="destructive" disabled={busy} onClick={remove}>
				Apagar conta
			</Button>
			{error && <p className="w-full text-sm text-destructive">{error}</p>}
		</div>
	);
}
