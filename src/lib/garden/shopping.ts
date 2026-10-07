import { cropBySlug, supplyBySlug } from "./catalog.ts";
import { range, round2 } from "./money.ts";
import type { Allocation, GardenInput, PriceRange, Shopping, ShoppingLine } from "./types.ts";

export function shoppingList(input: GardenInput, allocation: Allocation): Shopping {
	const lines: ShoppingLine[] = [];
	const owned = new Set(input.owned);
	const add = (slug: string, name: string, group: ShoppingLine["group"], quantity: number, unit: string, durable: boolean, price: PriceRange) => {
		if (quantity <= 0) return;
		const isOwned = owned.has(slug);
		lines.push({ slug, name, group, quantity, unit, durable, owned: isOwned, min: round2(price.min * quantity), max: round2(price.max * quantity), store: price.store, checkedAt: price.checkedAt });
	};
	const supply = (slug: string, quantity: number, unit = "un.") => {
		const s = supplyBySlug.get(slug);
		if (s) add(s.slug, s.name, s.group, quantity, unit, s.durable, s.price);
	};

	for (const a of allocation.crops) {
		const crop = cropBySlug.get(a.slug);
		if (!crop) continue;
		if (a.from === "planta" && crop.price.planta) add(crop.slug, crop.name, "plantas", a.quantity, "plantas", false, crop.price.planta);
		else add(crop.slug, `${crop.name} (sementes)`, "plantas", Math.ceil(a.quantity / crop.seedsPerPacket), "pacotes", false, crop.price.semente);
	}

	const { kind, widthCm, lengthCm } = input.space;
	const areaM2 = (widthCm * lengthCm) / 10000;
	if (kind === "vasos") {
		const containers = new Map<string, number>();
		for (const a of allocation.crops) {
			if (a.container) containers.set(a.container, (containers.get(a.container) ?? 0) + Math.ceil(a.quantity / a.perContainer));
		}
		let liters = 0;
		for (const [slug, n] of containers) {
			supply(slug, n);
			liters += n * (supplyBySlug.get(slug)?.volumeL ?? 0);
		}
		supply("substrato-50l", Math.ceil(liters / 50), "sacos");
	} else if (kind === "canteiro-elevado") {
		supply("substrato-50l", Math.ceil((areaM2 * 300) / 50), "sacos");
	} else {
		supply("composto-50l", Math.ceil((areaM2 * 10) / 50), "sacos");
	}

	supply("pa-mao", 1);
	supply("luvas", 1);
	if (input.irrigation === "regador") {
		supply("regador", 1);
	} else {
		supply("kit-gota-base", 1);
		const drippers = kind === "vasos" ? allocation.crops.reduce((s, a) => s + a.quantity, 0) : Math.ceil(areaM2);
		supply("gotejador", drippers);
	}

	const buy = lines.filter((l) => !l.owned);
	const sum = (ls: ShoppingLine[]) => range(ls.reduce((s, l) => s + l.min, 0), ls.reduce((s, l) => s + l.max, 0));
	return { lines, total: sum(buy), durableTotal: sum(buy.filter((l) => l.durable)) };
}
