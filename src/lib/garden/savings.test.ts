import assert from "node:assert/strict";
import { test } from "node:test";
import { allocate } from "./allocate.ts";
import { input } from "./fixtures.ts";
import { savings } from "./savings.ts";
import { shoppingList } from "./shopping.ts";
import type { GardenInput } from "./types.ts";

const save = (i: GardenInput) => {
	const a = allocate(i);
	return savings(a, shoppingList(i, a));
};

test("6 tomates em vaso não se pagam na 1.ª época, mas pagam-se na 2.ª", () => {
	const s = save(input({ crops: [{ slug: "tomate" }] }));
	assert.deepEqual(s.harvestValue, { min: 26.4, max: 52.8, mid: 39.6 });
	assert.equal(s.paybackWeeks, null);
	assert.equal(s.verdict, "paga-se na 2.ª época");
	assert.ok(s.nextSeason.mid > 0);
});

test("1 alecrim em vaso não compensa financeiramente", () => {
	const s = save(input({ crops: [{ slug: "alecrim", quantity: 1 }] }));
	assert.equal(s.verdict, "não compensa financeiramente");
});

test("terra com o que já se tem paga-se na 1.ª época e dá semanas", () => {
	const s = save(input({ space: { kind: "terra", widthCm: 300, lengthCm: 200 }, crops: [{ slug: "tomate" }, { slug: "curgete" }, { slug: "feijao-verde", from: "semente" }], owned: ["pa-mao", "luvas", "regador"] }));
	assert.equal(s.verdict, "paga-se na 1.ª época");
	assert.ok(s.paybackWeeks !== null && s.paybackWeeks > 8 && s.paybackWeeks < 20, String(s.paybackWeeks));
});

test("detalhe por cultura soma o valor total", () => {
	const s = save(input());
	assert.equal(Math.round(s.byCrop.reduce((t, c) => t + c.min, 0) * 100) / 100, s.harvestValue.min);
});
