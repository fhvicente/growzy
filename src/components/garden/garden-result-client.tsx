"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { GardenReport } from "@/components/garden/garden-report";
import { Button } from "@/components/ui/button";
import type { PlanView } from "@/lib/garden/redact";
import type { GardenInput } from "@/lib/garden/types";

type Props = {
	locale: string;
	garden: { id: number; name: string; input: GardenInput };
	view: PlanView;
	month: number;
};

export function GardenResultClient({ locale, garden, view, month }: Props) {
	const router = useRouter();
	// Estado local para resposta imediata; os envios vão em série para não se pisarem.
	const [owned, setOwned] = useState(garden.input.owned);
	const ownedRef = useRef(owned);
	const confirmedRef = useRef(garden.input.owned);
	const queueRef = useRef(Promise.resolve());
	const [pending, setPending] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const send = async (method: "PATCH" | "DELETE", body: object | undefined, failMsg: string) => {
		setPending((n) => n + 1);
		let ok = false;
		try {
			const res = await fetch(`/api/gardens/${garden.id}`, {
				method,
				headers: { "Content-Type": "application/json" },
				body: body ? JSON.stringify(body) : undefined,
			});
			const json = await res.json().catch(() => ({ ok: false }));
			ok = Boolean(json.ok);
		} catch {
			ok = false;
		} finally {
			setPending((n) => n - 1);
		}
		if (ok) setError(null);
		else setError(failMsg);
		return ok;
	};

	const toggleOwned = (slug: string, has: boolean) => {
		const without = (l: string[]) => l.filter((s) => s !== slug);
		ownedRef.current = has ? [...without(ownedRef.current), slug] : without(ownedRef.current);
		setOwned(ownedRef.current);
		queueRef.current = queueRef.current.then(async () => {
			const sent = ownedRef.current; // a lista mais recente no momento do envio
			if (
				await send(
					"PATCH",
					{ input: { ...garden.input, owned: sent } },
					"Não consegui guardar. Tenta outra vez.",
				)
			) {
				confirmedRef.current = sent;
				router.refresh();
			} else {
				ownedRef.current = confirmedRef.current;
				setOwned(confirmedRef.current);
			}
		});
	};

	const remove = async () => {
		if (!confirm(`Apagar "${garden.name}"?`)) return;
		if (await send("DELETE", undefined, "Não consegui apagar. Tenta outra vez."))
			router.push(`/${locale}/dashboard`);
	};

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm text-ink-soft">A tua horta</p>
					<h1 className="display text-4xl text-ink">{garden.name}</h1>
				</div>
				<div className="flex gap-2">
					<Link href={`/${locale}/calculator?garden=${garden.id}`}>
						<Button variant="outline" size="sm">
							Editar
						</Button>
					</Link>
					<Button variant="ghost" size="sm" onClick={remove} disabled={pending > 0}>
						Apagar
					</Button>
				</div>
			</div>
			{error && (
				<p role="alert" className="mt-4 text-sm text-destructive">
					{error}
				</p>
			)}
			<div className="mt-6">
				<GardenReport view={view} month={month} locale={locale} full onToggleOwned={toggleOwned} />
			</div>
		</div>
	);
}
