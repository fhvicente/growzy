import assert from "node:assert/strict";
import { test } from "node:test";
import { allocate } from "./allocate.ts";
import { input } from "./fixtures.ts";
import { shoppingList } from "./shopping.ts";

const shop = (i = input()) => shoppingList(i, allocate(i));

test("lista da varanda 2×1 m com tomate e manjericão", () => {
	const s = shop();
	const q = Object.fromEntries(s.lines.map((l) => [l.slug, l.quantity]));
	assert.deepEqual(q, { tomate: 6, manjericao: 4, "vaso-20l": 6, "floreira-80": 2, "substrato-50l": 4, "pa-mao": 1, luvas: 1, regador: 1 });
	assert.deepEqual(s.total, { min: 81.6, max: 163, mid: 122.3 });
});

test("o que já tenho fica na lista mas sai do total; total = soma das linhas", () => {
	const s = shop(input({ owned: ["regador"] }));
	assert.equal(s.lines.find((l) => l.slug === "regador")?.owned, true);
	const buy = s.lines.filter((l) => !l.owned);
	assert.equal(s.total.min, Math.round(buy.reduce((t, l) => t + l.min, 0) * 100) / 100);
	assert.equal(s.total.max, Math.round(buy.reduce((t, l) => t + l.max, 0) * 100) / 100);
	assert.deepEqual(s.total, { min: 76.6, max: 151, mid: 113.8 });
});

test("gota-a-gota em vasos: um gotejador por planta, sem regador", () => {
	const s = shop(input({ irrigation: "gota-a-gota" }));
	assert.equal(s.lines.find((l) => l.slug === "gotejador")?.quantity, 10);
	assert.ok(!s.lines.some((l) => l.slug === "regador"));
});

test("canteiro elevado de 1,2×0,8 m leva 300 L/m² de substrato; terra leva composto", () => {
	const c = shop(input({ space: { kind: "canteiro-elevado", widthCm: 120, lengthCm: 80 } }));
	assert.equal(c.lines.find((l) => l.slug === "substrato-50l")?.quantity, 6); // 0,96 m² × 300 = 288 L
	const t = shop(input({ space: { kind: "terra", widthCm: 500, lengthCm: 200 } }));
	assert.equal(t.lines.find((l) => l.slug === "composto-50l")?.quantity, 2); // 10 m² × 10 L
	assert.ok(!t.lines.some((l) => l.slug.startsWith("vaso-")));
});

test("sementes contam pacotes, não plantas", () => {
	const s = shop(input({ crops: [{ slug: "cenoura", quantity: 60 }] }));
	assert.deepEqual(s.lines.find((l) => l.slug === "cenoura"), { ...s.lines.find((l) => l.slug === "cenoura"), quantity: 1, unit: "pacotes" });
});

test("gota-a-gota em canteiro e terra: 4 gotejadores por m²", () => {
	const t = shop(input({ irrigation: "gota-a-gota", space: { kind: "terra", widthCm: 300, lengthCm: 300 } }));
	assert.equal(t.lines.find((l) => l.slug === "gotejador")?.quantity, 36); // 9 m² × 4
});
