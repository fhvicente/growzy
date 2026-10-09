import { applyCatalogPrices, defaultPrice, type PriceField } from "@/lib/catalog-prices";
import { db } from "@/lib/db";
import { CROPS, SUPPLIES } from "@/lib/garden/catalog";
import { catalogPrices } from "@/lib/schema";
import { PriceRow } from "./price-row";

export default async function AdminCatalogPage() {
	const [rows] = await Promise.all([db.select().from(catalogPrices), applyCatalogPrices(true)]);
	const edited = new Set(rows.map((r) => r.slug));

	type Item = { slug: string; name: string; fields: { field: PriceField; min: number; max: number }[] };
	const crops: Item[] = CROPS.map((c) => ({
		slug: c.slug,
		name: c.name,
		fields: [
			...(c.price.planta ? [{ field: "planta" as const, min: c.price.planta.min, max: c.price.planta.max }] : []),
			{ field: "semente", min: c.price.semente.min, max: c.price.semente.max },
			{ field: "mercado", min: c.marketEurKg, max: c.marketEurKg },
		],
	}));
	const supplies: Item[] = SUPPLIES.map((s) => ({
		slug: s.slug,
		name: s.name,
		fields: [{ field: "material", min: s.price.min, max: s.price.max }],
	}));
	const withDefaults = (items: Item[]) =>
		items.map((i) => ({
			...i,
			edited: edited.has(i.slug),
			fields: i.fields.map((f) => ({ ...f, def: defaultPrice(i.slug, f.field) as number[] })),
		}));

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold">Preços do catálogo</h1>
				<p className="mt-1 text-sm text-ink-soft">
					Em euros. Planta e semente por unidade/pacote (mín–máx); mercado em €/kg. Guardar o valor do código
					repõe-no. Outras instâncias do servidor veem a mudança em até 1 minuto.
				</p>
			</div>
			{[
				["Culturas", withDefaults(crops)],
				["Materiais", withDefaults(supplies)],
			].map(([title, items]) => (
				<section key={title as string}>
					<h2 className="font-semibold">{title as string}</h2>
					<div className="mt-2 divide-y divide-line/60">
						{(items as ReturnType<typeof withDefaults>).map((i) => (
							<PriceRow key={i.slug} {...i} />
						))}
					</div>
				</section>
			))}
		</div>
	);
}
