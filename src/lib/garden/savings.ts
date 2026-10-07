import { cropBySlug } from "./catalog.ts";
import { range } from "./money.ts";
import type { Allocation, Range, Savings, Shopping } from "./types.ts";

const HARVEST_WEEKS = 8; // ponytail: duração média da colheita, constante; calibrar com colheitas registadas (Fase 2)
const REFILL = 0.3; // fração de substrato/composto a repor por época

const minus = (a: Range, b: Range) => range(a.min - b.max, a.max - b.min);

export function savings(allocation: Allocation, shopping: Shopping): Savings {
	let low = 0;
	let high = 0;
	let weightedDays = 0;
	const byCrop = allocation.crops.flatMap((a) => {
		const crop = cropBySlug.get(a.slug);
		if (!crop) return [];
		const min = a.quantity * crop.yieldKg[0] * crop.marketEurKg;
		const max = a.quantity * crop.yieldKg[1] * crop.marketEurKg;
		low += min;
		high += max;
		const harvestDaysMean = (crop.daysToHarvest[0] + crop.daysToHarvest[1]) / 2;
		weightedDays += ((min + max) / 2) * harvestDaysMean;
		const cropRange = range(min, max);
		return [{ slug: a.slug, min: cropRange.min, max: cropRange.max }];
	});
	const harvestValue = range(low, high);
	const cost = shopping.total;

	const buy = shopping.lines.filter((l) => !l.owned);
	const refill = (l: (typeof buy)[number]) => (l.group === "plantas" ? 1 : l.slug === "substrato-50l" || l.slug === "composto-50l" ? REFILL : 0);
	const nextCost = range(
		buy.reduce((s, l) => s + l.min * refill(l), 0),
		buy.reduce((s, l) => s + l.max * refill(l), 0),
	);
	const nextSeason = minus(harvestValue, nextCost);

	let paybackWeeks: number | null = null;
	let verdict: Savings["verdict"];
	if (harvestValue.mid > cost.mid && harvestValue.mid > 0) {
		const weeksToHarvest = weightedDays / harvestValue.mid / 7;
		paybackWeeks = Math.round(weeksToHarvest + cost.mid / (harvestValue.mid / HARVEST_WEEKS));
		verdict = "paga-se na 1.ª época";
	} else {
		verdict = nextSeason.mid > 0 ? "paga-se na 2.ª época" : "não compensa financeiramente";
	}

	return { harvestValue, firstSeason: minus(harvestValue, cost), nextSeason, paybackWeeks, verdict, byCrop };
}
