import { cropMonths } from "./calendar.ts";
import { CLIMATE, cropBySlug } from "./catalog.ts";
import type { Allocation, GardenInput, Light, MonthWatering } from "./types.ts";

const MID_MONTH_DAY = [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const LIGHT_FACTOR: Record<Light, number> = { sol: 1, "meia-sombra": 0.75, sombra: 0.5 };
const DRIPPER_LH = 2;
/** Gotejadores por m² em canteiro e terra (espaçamento ~50 cm). */
export const DRIPPERS_PER_M2 = 4;
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Radiação extraterrestre Ra (MJ/m²/dia), FAO-56 eq. 21–25. */
export function extraterrestrialRadiation(latitudeDeg: number, dayOfYear: number): number {
	const phi = (latitudeDeg * Math.PI) / 180;
	const dr = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
	const delta = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
	const ws = Math.acos(-Math.tan(phi) * Math.tan(delta));
	return ((24 * 60) / Math.PI) * 0.082 * dr * (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws));
}

/** ET0 de Hargreaves (mm/dia). */
export function hargreavesEt0(ra: number, tMin: number, tMax: number): number {
	return 0.0023 * 0.408 * ra * ((tMin + tMax) / 2 + 17.8) * Math.sqrt(Math.max(0, tMax - tMin));
}

export function watering(input: GardenInput, allocation: Allocation): MonthWatering[] {
	const climate = CLIMATE[input.zone];
	const potted = input.space.kind === "vasos";
	const drip = input.irrigation === "gota-a-gota";

	return climate.months.map((c, i) => {
		const et0 = hargreavesEt0(extraterrestrialRadiation(climate.latitude, MID_MONTH_DAY[i]), c.tMin, c.tMax);
		// ponytail: vasos de varanda assumem-se abrigados da chuva
		const rainMm = potted ? 0 : (0.8 * c.precipMm) / DAYS_IN_MONTH[i];
		let weekly = 0;
		const perDripper: Record<string, number> = {}; // L/dia por gotejador, por cultura

		// Só as culturas que estão na horta neste mês.
		const present = allocation.crops.flatMap((a) => {
			const crop = cropBySlug.get(a.slug);
			return crop && cropMonths(crop, input.zone, a.from).active.includes(i + 1) ? [{ a, crop }] : [];
		});
		const crops = present.map(({ a, crop }) => {
			const kc = crop.kc;
			const canopyM2 = crop.spacingCm ** 2 / 10000;
			const netMm = Math.max(0, et0 * kc * LIGHT_FACTOR[input.light] - rainMm);
			const need = netMm * canopyM2; // 1 mm em 1 m² = 1 L
			weekly += need * 7 * a.quantity;
			if (need === 0) return { slug: a.slug, litersPerDay: 0, everyDays: null, litersPerWatering: 0, dripMinutes: null };

			// Rega-se quando o substrato perdeu metade da água disponível (20% do volume nos vasos, 10% em 300 mm de solo).
			const reserve = potted ? a.potLPerPlant * 0.2 * 0.5 : canopyM2 * 300 * 0.1 * 0.5;
			const everyDays = Math.min(7, Math.max(1, Math.floor(reserve / need)));
			const perWatering = need * everyDays;
			// Em vaso, um gotejador por planta; em canteiro e terra, DRIPPERS_PER_M2 por m².
			const dripLpd = potted ? need : netMm / DRIPPERS_PER_M2;
			perDripper[a.slug] = dripLpd;
			const dripLiters = dripLpd * everyDays;
			return {
				slug: a.slug,
				litersPerDay: Math.round(need * 100) / 100,
				everyDays,
				litersPerWatering: round1(perWatering),
				dripMinutes: drip ? Math.ceil((dripLiters / DRIPPER_LH) * 60) : null,
			};
		});

		const scheduled = crops.filter((w) => w.dripMinutes !== null && w.everyDays !== null);
		const hot = c.tMax >= 30;
		// Um só temporizador: ao menor intervalo, com os minutos que a cultura mais sedenta pede.
		let timer: MonthWatering["timer"] = null;
		if (scheduled.length) {
			const d = Math.min(...scheduled.map((w) => w.everyDays ?? 7));
			const lpd = scheduled.map((w) => perDripper[w.slug]);
			timer = { everyDays: d, minutes: Math.ceil(((Math.max(...lpd) * d) / DRIPPER_LH) * 60) };
			if (Math.max(...lpd) / Math.min(...lpd) > 2) timer.note = "As plantas com menos sede recebem água a mais: põe-nas noutra linha ou usa gotejadores de menor caudal.";
		}
		return {
			month: i + 1,
			et0: round1(et0),
			crops,
			litersPerWeek: round1(weekly),
			hint: hot && potted ? "Rega antes das 9h e, com calor, também ao fim da tarde nos vasos pequenos." : "Rega antes das 9h.",
			timer,
		};
	});
}
