import assert from "node:assert/strict";
import { test } from "node:test";
import { allocate } from "./allocate.ts";
import { calendar, cropMonths } from "./calendar.ts";
import { cropBySlug } from "./catalog.ts";
import { input } from "./fixtures.ts";
import type { GardenInput } from "./types.ts";

const cal = (i: GardenInput, month = 1) => calendar(i, allocate(i), month);

test("no sul, culturas quentes semeiam 1 mês antes; as frescas não mudam", () => {
	const crops = [{ slug: "tomate" }, { slug: "alface" }];
	const norte = cal(input({ crops, light: "sol" })).crops;
	const sul = cal(input({ crops, zone: "sul" })).crops;
	assert.deepEqual(norte[0].sow, [2, 3, 4]);
	assert.deepEqual(sul[0].sow, [1, 2, 3]);
	assert.deepEqual(sul[1].sow, norte[1].sow);
});

test("colheita dá a volta ao ano (fava semeada out–dez colhe fev–mai)", () => {
	const fava = cal(input({ crops: [{ slug: "fava" }] })).crops[0];
	assert.deepEqual(fava.harvest, [2, 3, 4, 5]);
});

test("próximo passo: planta comprada → transplantar; semente → semear", () => {
	const planta = cal(input({ crops: [{ slug: "tomate", from: "planta" }] }), 10).crops[0];
	const semente = cal(input({ crops: [{ slug: "tomate", from: "semente" }] }), 10).crops[0];
	assert.deepEqual(planta.next, { action: "transplantar", month: 4 });
	assert.deepEqual(semente.next, { action: "semear", month: 2 });
});

test("meses na horta: tomate de fev (sementeira) a ago; alecrim o ano todo", () => {
	assert.deepEqual(cropMonths(cropBySlug.get("tomate")!, "litoral-norte").active, [2, 3, 4, 5, 6, 7, 8]);
	assert.equal(cropMonths(cropBySlug.get("alecrim")!, "sul").active.length, 12);
});

test("vista mensal tem 12 meses e junta as culturas", () => {
	const c = cal(input());
	assert.equal(c.months.length, 12);
	assert.deepEqual(c.months[4], { month: 5, sow: ["manjericao"], transplant: ["tomate", "manjericao"], harvest: [] });
});
