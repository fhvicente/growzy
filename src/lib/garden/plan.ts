import { allocate } from "./allocate.ts";
import { calendar } from "./calendar.ts";
import { savings } from "./savings.ts";
import { shoppingList } from "./shopping.ts";
import type { GardenInput, GardenResult } from "./types.ts";
import { watering } from "./watering.ts";

export function planGarden(input: GardenInput, currentMonth: number): GardenResult {
	const allocation = allocate(input);
	const shopping = shoppingList(input, allocation);
	return {
		allocation,
		shopping,
		watering: watering(input, allocation),
		calendar: calendar(input, allocation, currentMonth),
		savings: savings(allocation, shopping),
	};
}

/** Mês atual (1–12) em Lisboa. */
export function lisbonMonth(date = new Date()): number {
	return Number(new Intl.DateTimeFormat("en", { timeZone: "Europe/Lisbon", month: "numeric" }).format(date));
}
