import { db } from "@/lib/db";
import { CROPS, cropBySlug, SUPPLIES, supplyBySlug } from "@/lib/garden/catalog";
import type { PriceRange } from "@/lib/garden/types";
import { catalogPrices } from "@/lib/schema";

export type PriceField = "planta" | "semente" | "mercado" | "material";

// Valores do código, copiados antes de qualquer alteração: servem para repor e para comparar.
type Default = { range: number[]; checkedAt?: string } | null;
const DEFAULTS = new Map<string, Default>();
const keyOf = (slug: string, field: PriceField) => `${slug}:${field}`;
for (const c of CROPS) {
	const { planta, semente } = c.price;
	DEFAULTS.set(keyOf(c.slug, "planta"), planta && { range: [planta.min, planta.max], checkedAt: planta.checkedAt });
	DEFAULTS.set(keyOf(c.slug, "semente"), { range: [semente.min, semente.max], checkedAt: semente.checkedAt });
	DEFAULTS.set(keyOf(c.slug, "mercado"), { range: [c.marketEurKg, c.marketEurKg] });
}
for (const s of SUPPLIES) {
	DEFAULTS.set(keyOf(s.slug, "material"), { range: [s.price.min, s.price.max], checkedAt: s.price.checkedAt });
}

/** [min, max] do código, ou undefined se o campo não existe para este slug (ex.: planta de feijão-verde). */
export const defaultPrice = (slug: string, field: PriceField) => DEFAULTS.get(keyOf(slug, field))?.range;

function set(slug: string, field: PriceField, [min, max]: number[], checkedAt?: string) {
	const crop = cropBySlug.get(slug);
	const supply = supplyBySlug.get(slug);
	const range = (old: PriceRange): PriceRange => ({ ...old, min, max, checkedAt: checkedAt ?? old.checkedAt });
	if (field === "mercado" && crop) crop.marketEurKg = min;
	else if (field === "semente" && crop) crop.price.semente = range(crop.price.semente);
	else if (field === "planta" && crop?.price.planta) crop.price.planta = range(crop.price.planta);
	else if (field === "material" && supply) supply.price = range(supply.price);
}

let loadedAt = 0;
const TTL_MS = 60_000;

/**
 * Põe os preços da BD por cima do catálogo em memória (os mesmos objetos que o motor lê).
 * ponytail: estado global por processo com cache de 60 s; noutras instâncias um preço novo
 * demora até 60 s a aparecer. Passar o catálogo para a BD se isso deixar de chegar.
 */
export async function applyCatalogPrices(force = false) {
	if (!force && Date.now() - loadedAt < TTL_MS) return;
	let rows: (typeof catalogPrices.$inferSelect)[];
	try {
		rows = await db.select().from(catalogPrices);
	} catch (error) {
		// Sem BD ficam os últimos preços conhecidos; o plano não deve falhar por isto.
		console.error("applyCatalogPrices failed", error);
		return;
	}
	loadedAt = Date.now();
	// Daqui para baixo é síncrono: nenhum pedido vê o catálogo a meio de ser reposto.
	for (const [key, value] of DEFAULTS) {
		const [slug, field] = key.split(":") as [string, PriceField];
		if (value) set(slug, field, value.range, value.checkedAt);
	}
	for (const r of rows) set(r.slug, r.field as PriceField, [r.min, r.max], r.updatedAt.toISOString().slice(0, 7));
}
