"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Field = { field: string; min: number; max: number; def: number[] };

const LABEL: Record<string, string> = {
	planta: "Planta",
	semente: "Semente",
	mercado: "Mercado €/kg",
	material: "Preço",
};
const inputCls = "h-9 w-20 rounded-md border border-line bg-paper px-2 text-sm";

export function PriceRow({
	slug,
	name,
	edited,
	fields,
}: {
	slug: string;
	name: string;
	edited: boolean;
	fields: Field[];
}) {
	const router = useRouter();
	const [values, setValues] = useState(fields.map((f) => [String(f.min), String(f.max)]));
	const [state, setState] = useState<"" | "busy" | "ok" | string>("");

	async function save(prices: { field: string; min: number; max: number }[]) {
		setState("busy");
		const res = await fetch("/api/admin/catalog", { method: "POST", body: JSON.stringify({ slug, prices }) });
		const data = await res.json().catch(() => null);
		setState(res.ok ? "ok" : (data?.error ?? "Falhou"));
		if (res.ok) router.refresh();
	}

	const edit = (i: number, j: number, v: string) =>
		setValues((old) => old.map((p, k) => (k === i ? (j ? [p[0], v] : [v, p[1]]) : p)));

	return (
		<form
			className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-sm"
			onSubmit={(e) => {
				e.preventDefault();
				void save(
					fields.map((f, i) => ({
						field: f.field,
						min: Number(values[i][0]),
						max: Number(values[i][f.field === "mercado" ? 0 : 1]),
					})),
				);
			}}
		>
			<span className="w-44 font-medium">
				{name}
				{edited && <span className="ml-2 rounded bg-sprout/40 px-1.5 text-xs text-moss-deep">editado</span>}
			</span>
			{fields.map((f, i) => (
				<label key={f.field} className="flex items-center gap-1" title={`Código: ${f.def.join("–")}`}>
					<span className="text-ink-soft">{LABEL[f.field]}</span>
					<input
						aria-label={`${name} ${LABEL[f.field]} mínimo`}
						className={inputCls}
						type="number"
						step="0.01"
						min="0"
						required
						value={values[i][0]}
						onChange={(e) => edit(i, 0, e.target.value)}
					/>
					{f.field !== "mercado" && (
						<>
							–
							<input
								aria-label={`${name} ${LABEL[f.field]} máximo`}
								className={inputCls}
								type="number"
								step="0.01"
								min="0"
								required
								value={values[i][1]}
								onChange={(e) => edit(i, 1, e.target.value)}
							/>
						</>
					)}
				</label>
			))}
			<Button size="sm" disabled={state === "busy"}>
				Guardar
			</Button>
			{edited && (
				<Button
					type="button"
					size="sm"
					variant="ghost"
					disabled={state === "busy"}
					onClick={() => {
						setValues(fields.map((f) => f.def.map(String)));
						void save(fields.map((f) => ({ field: f.field, min: f.def[0], max: f.def[1] })));
					}}
				>
					Repor
				</Button>
			)}
			{state === "ok" && <span className="text-moss">guardado</span>}
			{state && state !== "ok" && state !== "busy" && <span className="text-destructive">{state}</span>}
		</form>
	);
}
