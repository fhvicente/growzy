import type { Calendar, CropCalendar, GardenResult, Savings } from "./types.ts";

export type PlanAccess = { fullYearWatering: boolean; fullYearCalendar: boolean; savingsDetail: boolean };

export type PlanView = Omit<GardenResult, "calendar" | "savings"> & {
	calendar: { crops: (Pick<CropCalendar, "slug" | "next"> & Partial<CropCalendar>)[]; months: Calendar["months"] };
	savings: Omit<Savings, "nextSeason" | "byCrop"> & Partial<Pick<Savings, "nextSeason" | "byCrop">>;
	locked: string[];
};

/** Tira do resultado o que o plano não inclui. Corre só no servidor. */
export function redactForPlan(result: GardenResult, access: PlanAccess, currentMonth: number): PlanView {
	const view: PlanView = { ...result, locked: [] };
	if (!access.fullYearWatering) {
		view.watering = result.watering.filter((w) => w.month === currentMonth);
		view.locked.push("watering.year");
	}
	if (!access.fullYearCalendar) {
		view.calendar = {
			crops: result.calendar.crops.map(({ slug, next }) => ({ slug, next })),
			months: result.calendar.months.filter((m) => m.month === currentMonth),
		};
		view.locked.push("calendar.year");
	}
	if (!access.savingsDetail) {
		const { nextSeason: _n, byCrop: _b, ...rest } = result.savings;
		view.savings = rest;
		view.locked.push("savings.detail");
	}
	return view;
}
