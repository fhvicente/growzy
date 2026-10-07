"use client";

import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GardenReport } from "@/components/garden/garden-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lightOk } from "@/lib/garden/allocate";
import { CROPS, cropBySlug } from "@/lib/garden/catalog";
import type { PlanView } from "@/lib/garden/redact";
import type { GardenInput } from "@/lib/garden/types";
import { cn } from "@/lib/utils";

const DEFAULT_INPUT: GardenInput = {
	zone: "litoral-norte",
	space: { kind: "vasos", widthCm: 200, lengthCm: 100 },
	light: "sol",
	irrigation: "regador",
	crops: [],
	owned: [],
};

const norm = (s: string) =>
	s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();
const validSize = (n: number) => Number.isInteger(n) && n >= 30 && n <= 2000;

function Choice<T extends string>({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: T;
	options: [T, string][];
	onChange: (v: T) => void;
}) {
	return (
		<fieldset className="space-y-2">
			<legend className="text-sm font-semibold text-ink">{label}</legend>
			<div className="flex flex-wrap gap-2">
				{options.map(([v, text]) => (
					<button
						key={v}
						type="button"
						aria-pressed={value === v}
						onClick={() => onChange(v)}
						className={cn(
							"min-h-11 rounded-full border px-4 text-sm transition-colors duration-200",
							value === v ? "border-moss bg-moss text-paper" : "border-line bg-card text-ink hover:border-moss",
						)}
					>
						{text}
					</button>
				))}
			</div>
		</fieldset>
	);
}

type Props = { locale: string; garden?: { id: number; name: string; input: GardenInput } };

export function CalculatorClient({ locale, garden }: Props) {
	const router = useRouter();
	const [input, setInput] = useState<GardenInput>(garden?.input ?? DEFAULT_INPUT);
	const [query, setQuery] = useState("");
	const [result, setResult] = useState<{ view: PlanView; month: number } | null>(null);
	const [error, setError] = useState<{ text: string } | null>(null);
	const [name, setName] = useState(garden?.name ?? "");
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<{ text: string; upgrade?: boolean } | null>(null);

	const update = (fn: (i: GardenInput) => GardenInput) => {
		setSaveError(null);
		setInput(fn);
	};
	const set = (patch: Partial<GardenInput>) => update((i) => ({ ...i, ...patch }));
	const setSpace = (patch: Partial<GardenInput["space"]>) => update((i) => ({ ...i, space: { ...i.space, ...patch } }));
	const setCrop = (slug: string, patch: Partial<GardenInput["crops"][number]>) =>
		update((i) => ({ ...i, crops: i.crops.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) }));

	const sizesOk = validSize(input.space.widthCm) && validSize(input.space.lengthCm);
	const ready = input.crops.length > 0 && sizesOk;

	useEffect(() => {
		if (!ready) return;
		const controller = new AbortController();
		const timer = setTimeout(async () => {
			try {
				const res = await fetch("/api/garden/plan", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(input),
					signal: controller.signal,
				});
				const json = await res.json();
				if (!json.ok) throw new Error(json.error);
				setResult(json.data);
				setError(null);
			} catch {
				if (!controller.signal.aborted) setError({ text: "Não consegui recalcular. Mostro o último resultado." });
			}
		}, 300);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [input, ready]);

	const matches = useMemo(() => {
		const chosen = new Set(input.crops.map((c) => c.slug));
		return CROPS.filter((c) => !chosen.has(c.slug) && norm(c.name).includes(norm(query)));
	}, [query, input.crops]);

	const autoQty = (slug: string) => result?.view.allocation.crops.find((a) => a.slug === slug)?.quantity ?? 1;

	const save = async () => {
		setSaving(true);
		setSaveError(null);
		try {
			const res = await fetch(garden ? `/api/gardens/${garden.id}` : "/api/gardens", {
				method: garden ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: name.trim(), input }),
			});
			const json = await res.json().catch(() => ({ ok: false }));
			if (!json.ok) {
				setSaveError({ text: json.error ?? "Não consegui guardar.", upgrade: json.code === "PLAN_LIMIT_EXCEEDED" });
				return;
			}
			router.push(`/${locale}/calculator/result/${json.data.id}`);
		} catch {
			setSaveError({ text: "Não consegui guardar. Verifica a ligação e tenta outra vez." });
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="display text-4xl text-ink">{garden ? `Editar ${garden.name}` : "Planeia a tua horta"}</h1>
			<p className="mt-2 text-ink-soft">Diz-nos o espaço e o que queres plantar. Nós fazemos as contas.</p>

			<div className="mt-8 grid gap-8 lg:grid-cols-[1fr_26rem]">
				<div className="space-y-6">
					<section className="space-y-5 rounded-lg border border-line bg-card p-5">
						<h2 className="font-display text-xl font-bold text-ink">1. O teu espaço</h2>
						<Choice
							label="Onde vais plantar"
							value={input.space.kind}
							options={[
								["vasos", "Vasos e floreiras"],
								["canteiro-elevado", "Canteiro elevado"],
								["terra", "Terra"],
							]}
							onChange={(kind) => setSpace({ kind })}
						/>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label htmlFor="width">Largura (cm)</Label>
								<Input
									id="width"
									type="number"
									inputMode="numeric"
									min={30}
									max={2000}
									value={input.space.widthCm || ""}
									onChange={(e) => setSpace({ widthCm: Number(e.target.value) })}
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="length">Comprimento (cm)</Label>
								<Input
									id="length"
									type="number"
									inputMode="numeric"
									min={30}
									max={2000}
									value={input.space.lengthCm || ""}
									onChange={(e) => setSpace({ lengthCm: Number(e.target.value) })}
								/>
							</div>
						</div>
						{!sizesOk && <p className="text-sm text-destructive">As medidas vão de 30 a 2000 cm, em números inteiros.</p>}
						<Choice
							label="Sol direto por dia"
							value={input.light}
							options={[
								["sol", "6 h ou mais"],
								["meia-sombra", "3 a 6 h"],
								["sombra", "menos de 3 h"],
							]}
							onChange={(light) => set({ light })}
						/>
						<Choice
							label="Zona"
							value={input.zone}
							options={[
								["litoral-norte", "Norte e litoral centro"],
								["interior", "Interior"],
								["sul", "Sul e ilhas"],
							]}
							onChange={(zone) => set({ zone })}
						/>
						<Choice
							label="Como vais regar"
							value={input.irrigation}
							options={[
								["regador", "Regador"],
								["gota-a-gota", "Gota-a-gota"],
							]}
							onChange={(irrigation) => set({ irrigation })}
						/>
					</section>

					<section className="space-y-4 rounded-lg border border-line bg-card p-5">
						<h2 className="font-display text-xl font-bold text-ink">2. O que queres plantar</h2>
						{input.crops.length > 0 && (
							<ul className="space-y-2">
								{input.crops.map((c) => {
									const crop = cropBySlug.get(c.slug);
									const q = c.quantity ?? autoQty(c.slug);
									return (
										<li key={c.slug} className="flex flex-wrap items-center gap-2 rounded-md border border-line p-2 pl-3">
											<span className="flex-1 font-medium text-ink">{crop?.name ?? c.slug}</span>
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Menos ${crop?.name}`}
												onClick={() => setCrop(c.slug, { quantity: q > 1 ? q - 1 : undefined })}
											>
												<Minus className="h-4 w-4" />
											</Button>
											<span className="w-10 text-center tabular-nums" aria-live="polite">
												{q}
											</span>
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Mais ${crop?.name}`}
												onClick={() => setCrop(c.slug, { quantity: Math.min(200, q + 1) })}
											>
												<Plus className="h-4 w-4" />
											</Button>
											{c.quantity ? (
												<button
													type="button"
													className="min-h-11 min-w-11 text-xs text-moss underline"
													onClick={() => setCrop(c.slug, { quantity: undefined })}
												>
													auto
												</button>
											) : (
												<span className="text-xs text-ink-soft">auto</span>
											)}
											{crop?.price.planta && (
												<button
													type="button"
													className="min-h-11 rounded-full border border-line px-3 text-xs"
													aria-label={`Comprar ${crop.name} como ${c.from === "semente" ? "planta" : "semente"}`}
													onClick={() => setCrop(c.slug, { from: c.from === "semente" ? "planta" : "semente" })}
												>
													{c.from === "semente" ? "semente" : "planta"}
												</button>
											)}
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Tirar ${crop?.name}`}
												onClick={() => set({ crops: input.crops.filter((x) => x.slug !== c.slug) })}
											>
												<X className="h-4 w-4" />
											</Button>
										</li>
									);
								})}
							</ul>
						)}
						<Input
							placeholder="Procura: tomate, alface, manjericão…"
							aria-label="Procurar cultura"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<ul className="flex flex-wrap gap-2">
							{matches.map((c) => {
								const ok = lightOk(c, input.light);
								return (
									<li key={c.slug}>
										<button
											type="button"
											disabled={!ok || input.crops.length >= 15}
											onClick={() => {
												set({ crops: [...input.crops, { slug: c.slug }] });
												setQuery("");
											}}
											className={cn(
												"min-h-11 rounded-full border border-line px-3 text-sm",
												ok ? "text-ink hover:border-moss" : "cursor-not-allowed text-ink-soft line-through",
											)}
										>
											{c.name}
											{!ok && <span className="sr-only"> (precisa de mais sol)</span>}
										</button>
									</li>
								);
							})}
						</ul>
						{input.light !== "sol" && (
							<p className="text-xs text-ink-soft">As culturas riscadas precisam de mais sol do que tens.</p>
						)}
					</section>
				</div>

				<aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
					{!ready && (
						<p className="rounded-lg border border-dashed border-line p-5 text-ink-soft">
							Escolhe pelo menos uma cultura para ver as contas.
						</p>
					)}
					{error && (
						<p role="alert" className="text-sm text-destructive">
							{error.text}
						</p>
					)}
					{ready && result && (
						<>
							<GardenReport view={result.view} month={result.month} locale={locale} />
							<div className="space-y-2 rounded-lg border border-line bg-card p-4">
								<Label htmlFor="garden-name">Nome da horta</Label>
								<Input
									id="garden-name"
									maxLength={80}
									placeholder="Varanda da cozinha"
									value={name}
									onChange={(e) => {
									setName(e.target.value);
									setSaveError(null);
								}}
								/>
								<Button className="w-full" disabled={saving || !name.trim()} onClick={save}>
									{garden ? "Guardar alterações" : "Guardar horta"}
								</Button>
								{saveError && (
									<p role="alert" className="text-sm text-destructive">
										{saveError.text}{" "}
										{saveError.upgrade && (
											<Link href={`/${locale}/pricing`} className="underline">
												Ver planos
											</Link>
										)}
									</p>
								)}
							</div>
						</>
					)}
				</aside>
			</div>
		</div>
	);
}
