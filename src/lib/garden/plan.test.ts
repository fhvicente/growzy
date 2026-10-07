import assert from "node:assert/strict";
import { test } from "node:test";
import { input } from "./fixtures.ts";
import { lisbonMonth, planGarden } from "./plan.ts";
import { redactForPlan } from "./redact.ts";
import { gardenBodySchema, gardenInputSchema } from "./schema.ts";

test("Grátis só recebe o mês atual e a lista do que está bloqueado", () => {
	const v = redactForPlan(planGarden(input(), 7), { fullYearWatering: false, fullYearCalendar: false, savingsDetail: false }, 7);
	assert.deepEqual(v.watering.map((w) => w.month), [7]);
	assert.deepEqual(v.calendar.months.map((m) => m.month), [7]);
	assert.equal(v.calendar.crops[0].sow, undefined);
	assert.ok(v.calendar.crops[0].next);
	assert.equal("nextSeason" in v.savings, false);
	assert.equal("byCrop" in v.savings, false);
	assert.deepEqual(v.locked, ["watering.year", "calendar.year", "savings.detail"]);
	assert.ok(!JSON.stringify(v).includes('"month":8'));
});

test("Standard recebe tudo", () => {
	const v = redactForPlan(planGarden(input(), 7), { fullYearWatering: true, fullYearCalendar: true, savingsDetail: true }, 7);
	assert.equal(v.watering.length, 12);
	assert.deepEqual(v.locked, []);
});

test("mês de Lisboa na passagem de ano", () => {
	assert.equal(lisbonMonth(new Date("2026-12-31T23:30:00Z")), 12);
	assert.equal(lisbonMonth(new Date("2026-06-30T23:30:00Z")), 7); // 00:30 de 1 de julho em Lisboa (verão)
});

test("validação rejeita slugs desconhecidos, medidas fora dos limites, repetidos e mais de 15", () => {
	const ok = gardenInputSchema.safeParse(input());
	assert.equal(ok.success, true);
	const bad = (o: object) => gardenInputSchema.safeParse({ ...input(), ...o }).success;
	assert.equal(bad({ crops: [{ slug: "bananeira" }] }), false);
	assert.equal(bad({ space: { kind: "vasos", widthCm: 10, lengthCm: 100 } }), false);
	assert.equal(bad({ space: { kind: "vasos", widthCm: 100.5, lengthCm: 100 } }), false);
	assert.equal(bad({ crops: [{ slug: "tomate" }, { slug: "tomate" }] }), false);
	assert.equal(bad({ crops: Array.from({ length: 16 }, () => ({ slug: "tomate" })) }), false);
	assert.equal(bad({ owned: ["helicoptero"] }), false);
	assert.equal(bad({ crops: [{ slug: "tomate", quantity: 0 }] }), false);
});

test("nome da horta: obrigatório, sem espaços à volta, até 80", () => {
	assert.equal(gardenBodySchema.safeParse({ name: "   ", input: input() }).success, false);
	assert.equal(gardenBodySchema.safeParse({ name: "x".repeat(81), input: input() }).success, false);
	const ok = gardenBodySchema.safeParse({ name: "  Varanda  ", input: input() });
	assert.equal(ok.success && ok.data.name, "Varanda");
});
