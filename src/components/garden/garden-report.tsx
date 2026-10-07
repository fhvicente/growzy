import { Lock } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cropBySlug, supplyBySlug } from "@/lib/garden/catalog";
import type { PlanView } from "@/lib/garden/redact";
import type { AllocatedCrop, ShoppingLine } from "@/lib/garden/types";
import { cn } from "@/lib/utils";

export const MONTHS = [
	"janeiro",
	"fevereiro",
	"março",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro",
];

export const everyLabel = (n: number) => (n === 1 ? "todos os dias" : `de ${n} em ${n} dias`);

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
const liters = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 });
const money = (min: number, max: number) => `${euro.format(min)} – ${euro.format(max)}`;
const cropName = (slug: string) => cropBySlug.get(slug)?.name ?? slug;
const containerLabel = (c: AllocatedCrop) =>
	c.container === "floreira-80"
		? `${c.perContainer} por floreira de 80 cm`
		: `vaso de ${supplyBySlug.get(c.container ?? "")?.volumeL} L`;

const GROUPS: [ShoppingLine["group"], string][] = [
	["plantas", "Plantas e sementes"],
	["recipientes", "Recipientes e substrato"],
	["ferramentas", "Ferramentas"],
	["rega", "Rega"],
];

const LOCKED: Record<string, string> = {
	"watering.year": "rega mês a mês, o ano inteiro",
	"calendar.year": "calendário de 12 meses",
	"savings.detail": "poupança por cultura e a partir da 2.ª época",
};

function Box({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="rounded-lg border border-line bg-card p-4">
			<h3 className="mb-2 font-display text-lg font-bold text-ink">{title}</h3>
			{children}
		</section>
	);
}

function MonthTasks({ m }: { m: PlanView["calendar"]["months"][number] }) {
	const rows: [string, string[]][] = [
		["Semear", m.sow],
		["Transplantar", m.transplant],
		["Colher", m.harvest],
	];
	const filled = rows.filter(([, slugs]) => slugs.length);
	if (!filled.length) return <p className="text-sm text-ink-soft">Nada a semear, transplantar ou colher.</p>;
	return (
		<ul className="space-y-1 text-sm">
			{filled.map(([label, slugs]) => (
				<li key={label}>
					<strong>{label}:</strong> {slugs.map(cropName).join(", ")}
				</li>
			))}
		</ul>
	);
}

type Props = {
	view: PlanView;
	month: number;
	locale: string;
	full?: boolean;
	onToggleOwned?: (slug: string, owned: boolean) => void;
};

export function GardenReport({ view, month, locale, full = false, onToggleOwned }: Props) {
	const { allocation, shopping, savings, calendar } = view;
	const quantity = new Map(allocation.crops.map((c) => [c.slug, c.quantity]));
	const now = calendar.months.find((m) => m.month === month);
	const waterMonths = full ? view.watering : view.watering.filter((w) => w.month === month);
	const [year, mm] = (shopping.lines[0]?.checkedAt ?? "").split("-");

	return (
		<div className="space-y-4">
			<Box title="Espaço">
				<div
					className="h-2 overflow-hidden rounded-full bg-paper-2"
					role="meter"
					aria-label="Espaço ocupado"
					aria-valuenow={allocation.usedPct}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<div
						className={allocation.usedPct > 100 ? "h-full bg-tomato" : "h-full bg-moss"}
						style={{ width: `${Math.min(100, allocation.usedPct)}%` }}
					/>
				</div>
				<p className="mt-2 text-sm text-ink-soft">{allocation.usedPct}% do espaço ocupado</p>
				{allocation.warnings.map((w) => (
					<p key={w} className="mt-1 text-sm font-semibold text-tomato-deep">
						{w}
					</p>
				))}
				<ul className="mt-3 space-y-1 text-sm">
					{allocation.crops.map((c) => (
						<li key={c.slug}>
							{cropName(c.slug)}: <strong className="tabular-nums">{c.quantity}</strong>
							{c.container ? ` · ${containerLabel(c)}` : ""}
						</li>
					))}
				</ul>
				{allocation.excluded.map((e) => (
					<p key={e.slug} className="mt-1 text-sm text-ink-soft">
						<span className="line-through">{cropName(e.slug)}</span>: {e.reason}
					</p>
				))}
			</Box>

			<Box title="Custo">
				<p className="display text-4xl tabular-nums text-ink">{euro.format(shopping.total.mid)}</p>
				<p className="text-sm text-ink-soft">
					entre {money(shopping.total.min, shopping.total.max)} · estimativa
					{mm ? `, preços de ${MONTHS[Number(mm) - 1].slice(0, 3)}/${year}` : ""}
				</p>
			</Box>

			<Box title="Compensa?">
				<p className="font-semibold text-ink">
					{savings.paybackWeeks !== null
						? `Paga-se em cerca de ${savings.paybackWeeks} semanas`
						: savings.verdict === "paga-se em várias épocas"
							? `Não se paga na 1.ª época. Paga-se em cerca de ${savings.seasonsToPayback} épocas.`
							: "Não compensa financeiramente. Mas sabe melhor."}
				</p>
				<p className="mt-1 text-sm text-ink-soft">
					Colheita estimada: {money(savings.harvestValue.min, savings.harvestValue.max)} a preços de supermercado.
				</p>
				<p className="text-sm text-ink-soft">Saldo da 1.ª época: {money(savings.firstSeason.min, savings.firstSeason.max)}</p>
				{savings.nextSeason && (
					<p className="text-sm text-ink-soft">
						Saldo a partir da 2.ª: {money(savings.nextSeason.min, savings.nextSeason.max)} por época
					</p>
				)}
				{full && savings.byCrop && (
					<ul className="mt-2 space-y-1 text-sm">
						{savings.byCrop.map((c) => (
							<li key={c.slug}>
								{cropName(c.slug)}: {money(c.min, c.max)}
							</li>
						))}
					</ul>
				)}
			</Box>

			<Box title={waterMonths.length > 1 ? "Rega, mês a mês" : `Rega em ${MONTHS[month - 1]}`}>
				{waterMonths.map((w) => (
					<div key={w.month} className="border-t border-line py-2 first:border-t-0 first:pt-0">
						{waterMonths.length > 1 && <h4 className="text-sm font-semibold capitalize">{MONTHS[w.month - 1]}</h4>}
						{w.crops.length === 0 ? (
							<p className="text-sm text-ink-soft">Nada na horta este mês.</p>
						) : (
							<>
								<ul className="space-y-1 text-sm">
									{w.crops.map((c) => (
										<li key={c.slug}>
											{cropName(c.slug)} ({quantity.get(c.slug)}):{" "}
											{c.everyDays === null
												? "a chuva chega"
												: `${liters.format(c.litersPerWatering)} L cada, ${everyLabel(c.everyDays)}`}
										</li>
									))}
								</ul>
								{w.timer && (
									<p className="mt-1 text-sm">
										Temporizador: {w.timer.minutes} min, {everyLabel(w.timer.everyDays)}, às 7h00.
									</p>
								)}
								{w.timer?.note && <p className="text-xs text-ink-soft">{w.timer.note}</p>}
								<p className="mt-1 text-xs text-ink-soft">
									{w.hint} Cerca de {liters.format(w.litersPerWeek)} L por semana.
								</p>
							</>
						)}
					</div>
				))}
			</Box>

			<Box title={`Em ${MONTHS[month - 1]}`}>
				{now && <MonthTasks m={now} />}
				<ul className="mt-2 space-y-1 text-sm text-ink-soft">
					{calendar.crops.map(
						(c) =>
							c.next && (
								<li key={c.slug}>
									{cropName(c.slug)}: {c.next.action === "semear" ? "semeia" : "transplanta"}{" "}
									{c.next.month === month ? "já" : `em ${MONTHS[c.next.month - 1]}`}
								</li>
							),
					)}
				</ul>
				<p className="mt-2 text-xs text-ink-soft">Datas aproximadas para a tua zona.</p>
			</Box>

			{full && calendar.months.length > 1 && (
				<Box title="Calendário do ano">
					<ul className="divide-y divide-line">
						{calendar.months.map((m) => (
							<li key={m.month} className="py-2">
								<h4 className="text-sm font-semibold capitalize">{MONTHS[m.month - 1]}</h4>
								<MonthTasks m={m} />
							</li>
						))}
					</ul>
				</Box>
			)}

			{full && (
				<Box title="Lista de compras">
					{GROUPS.map(([group, label]) => {
						const lines = shopping.lines.filter((l) => l.group === group);
						if (!lines.length) return null;
						return (
							<div key={group} className="mt-3 first:mt-0">
								<h4 className="text-sm font-semibold">{label}</h4>
								<ul className="divide-y divide-line">
									{lines.map((l) => (
										<li key={l.slug} className="flex items-center gap-3 text-sm">
											<label className="flex min-h-11 flex-1 items-center gap-3">
												{onToggleOwned && l.group !== "plantas" && (
													<input
														type="checkbox"
														className="h-5 w-5 accent-moss"
														checked={l.owned}
														onChange={(e) => onToggleOwned(l.slug, e.target.checked)}
														aria-label={`Já tenho: ${l.name}`}
													/>
												)}
												<span className={cn("flex-1", l.owned && "text-ink-soft line-through")}>
													{l.quantity} {l.unit} · {l.name}
												</span>
											</label>
											<span className="tabular-nums">{money(l.min, l.max)}</span>
										</li>
									))}
								</ul>
							</div>
						);
					})}
					{onToggleOwned && <p className="mt-2 text-xs text-ink-soft">Marca o que já tens: sai do total.</p>}
				</Box>
			)}

			{view.locked.length > 0 && (
				<Link
					href={`/${locale}/pricing`}
					className="flex items-start gap-3 rounded-lg border border-dashed border-moss/40 p-4 text-sm text-ink hover:bg-paper-2"
				>
					<Lock className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
					<span>
						<strong>No Standard:</strong> {view.locked.map((k) => LOCKED[k]).join(", ")}.
					</span>
				</Link>
			)}
		</div>
	);
}
