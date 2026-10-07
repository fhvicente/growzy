import { cropBySlug } from "./catalog.ts";
import type { Allocation, Calendar, Crop, CropCalendar, GardenInput, Zone } from "./types.ts";

const wrap = (m: number) => ((((m - 1) % 12) + 12) % 12) + 1;
const ZONE_SHIFT: Record<Zone, number> = { "litoral-norte": 0, interior: 1, sul: -1 };

/** Meses de uma cultura numa zona: semear, transplantar, colher e meses em que está na horta. */
export function cropMonths(crop: Crop, zone: Zone) {
	// ponytail: ajuste de zona de ±1 mês só nas culturas de estação quente (heurística, dita na UI)
	const shift = crop.season === "quente" ? ZONE_SHIFT[zone] : 0;
	const sow = crop.sowMonths.map((m) => wrap(m + shift));
	const transplant = crop.transplantMonths.map((m) => wrap(m + shift));
	const harvest = new Set<number>();
	const active = new Set<number>(crop.perennial ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : sow);
	for (const m of transplant.length ? transplant : sow) {
		const first = Math.floor(crop.daysToHarvest[0] / 30);
		const last = Math.ceil(crop.daysToHarvest[1] / 30);
		for (let k = 0; k <= last; k++) {
			active.add(wrap(m + k));
			if (k >= first) harvest.add(wrap(m + k));
		}
	}
	const sorted = (s: Set<number>) => [...s].sort((x, y) => x - y);
	return { sow, transplant, harvest: sorted(harvest), active: sorted(active) };
}

export function calendar(input: GardenInput, allocation: Allocation, currentMonth: number): Calendar {
	const crops: CropCalendar[] = allocation.crops.flatMap((a) => {
		const crop = cropBySlug.get(a.slug);
		if (!crop) return [];
		const { sow, transplant, harvest } = cropMonths(crop, input.zone);
		const useTransplant = transplant.length > 0 && (a.from === "planta" || sow.length === 0);
		const action = useTransplant ? "transplantar" : "semear";
		const list = useTransplant ? transplant : sow;
		let next: CropCalendar["next"] = null;
		for (let k = 0; k < 12 && !next; k++) {
			const month = wrap(currentMonth + k);
			if (list.includes(month)) next = { action, month };
		}
		return [{ slug: a.slug, sow, transplant, harvest, next }];
	});

	const months = Array.from({ length: 12 }, (_, i) => {
		const month = i + 1;
		return {
			month,
			sow: crops.filter((c) => c.sow.includes(month)).map((c) => c.slug),
			transplant: crops.filter((c) => c.transplant.includes(month)).map((c) => c.slug),
			harvest: crops.filter((c) => c.harvest.includes(month)).map((c) => c.slug),
		};
	});
	return { crops, months };
}
