import assert from "node:assert/strict";
import { test } from "node:test";
import { allocate } from "./allocate.ts";
import { CROPS } from "./catalog.ts";
import { input } from "./fixtures.ts";
import { extraterrestrialRadiation, hargreavesEt0, watering } from "./watering.ts";
import type { GardenInput } from "./types.ts";

const water = (i: GardenInput) => watering(i, allocate(i));

test("Ra bate com o exemplo 8 da FAO-56 (20° S, 3 de setembro → 32,2 MJ/m²/dia)", () => {
	assert.ok(Math.abs(extraterrestrialRadiation(-20, 246) - 32.2) < 0.1);
});

test("ET0 de julho em Faro fica entre 4,5 e 6,5 mm/dia", () => {
	const ra = extraterrestrialRadiation(37, 196);
	const et0 = hargreavesEt0(ra, 19.4, 29.1);
	assert.ok(et0 > 4.5 && et0 < 6.5, String(et0));
});

test("dias entre regas ficam sempre entre 1 e 7", () => {
	for (const zone of ["litoral-norte", "interior", "sul"] as const) {
		for (const kind of ["vasos", "canteiro-elevado", "terra"] as const) {
			const months = water(input({ zone, space: { kind, widthCm: 400, lengthCm: 300 }, crops: CROPS.slice(0, 15).map((c) => ({ slug: c.slug })) }));
			for (const m of months) for (const c of m.crops) if (c.everyDays !== null) assert.ok(c.everyDays >= 1 && c.everyDays <= 7);
		}
	}
});

test("em terra no inverno do Porto, a chuva chega", () => {
	const jan = water(input({ space: { kind: "terra", widthCm: 200, lengthCm: 100 }, crops: [{ slug: "alface" }] }))[0];
	assert.deepEqual({ every: jan.crops[0].everyDays, l: jan.crops[0].litersPerDay }, { every: null, l: 0 });
});

test("só rega o que está na horta nesse mês; perenes o ano inteiro", () => {
	const months = water(input({ crops: [{ slug: "tomate" }, { slug: "alecrim" }] }));
	assert.deepEqual(months[0].crops.map((c) => c.slug), ["alecrim"]); // janeiro: sem tomate
	assert.deepEqual(months[6].crops.map((c) => c.slug), ["tomate", "alecrim"]);
});

test("tomate em vaso no julho de Castelo Branco: rega diária e aviso de calor", () => {
	const jul = water(input({ zone: "interior", crops: [{ slug: "tomate" }] }))[6];
	assert.equal(jul.crops[0].everyDays, 1);
	assert.match(jul.hint, /fim da tarde/);
	assert.ok(jul.crops[0].litersPerDay > 1 && jul.crops[0].litersPerDay < 2.5, String(jul.crops[0].litersPerDay));
});

test("gota-a-gota dá minutos e o temporizador usa o menor intervalo", () => {
	const jul = water(input({ irrigation: "gota-a-gota" }))[6];
	assert.ok(jul.crops.every((c) => (c.dripMinutes ?? 0) > 0));
	assert.equal(jul.timer?.everyDays, Math.min(...jul.crops.map((c) => c.everyDays ?? 7)));
});

test("menos luz, menos água", () => {
	const sol = water(input({ crops: [{ slug: "alface" }] }))[6].crops[0].litersPerDay;
	const meia = water(input({ light: "meia-sombra", crops: [{ slug: "alface" }] }))[6].crops[0].litersPerDay;
	assert.ok(meia < sol);
});
