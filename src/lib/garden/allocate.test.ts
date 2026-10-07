import assert from "node:assert/strict";
import { test } from "node:test";
import { allocate } from "./allocate.ts";
import { input } from "./fixtures.ts";

test("2×1 m de vasos ao sol: tomate em vaso de 20 L, manjericão em floreira, ambos no teto", () => {
	const a = allocate(input());
	assert.equal(a.usableCm2, 16000);
	const [tomate, manjericao] = a.crops;
	assert.deepEqual(
		{ q: tomate.quantity, c: tomate.container, fp: tomate.footprintCm2 },
		{ q: 6, c: "vaso-20l", fp: 1225 },
	);
	assert.deepEqual({ q: manjericao.quantity, c: manjericao.container, per: manjericao.perContainer }, { q: 4, c: "floreira-80", per: 3 });
	assert.equal(a.usedPct, 59); // (6×1225 + 4×533,3) / 16000
	assert.deepEqual(a.warnings, []);
});

test("área que sobra do teto de uma cultura passa para as outras", () => {
	// 1 m² de terra: manjericão (625 cm², teto 4) usa 2500; couve (2025 cm²) fica com 7500 → 3, não 2
	const a = allocate(input({ space: { kind: "terra", widthCm: 100, lengthCm: 100 }, crops: [{ slug: "manjericao" }, { slug: "couve" }] }));
	assert.deepEqual(a.crops.map((c) => c.quantity), [4, 3]);
});

test("quantidades manuais acima do espaço avisam mas calculam", () => {
	const a = allocate(input({ space: { kind: "vasos", widthCm: 100, lengthCm: 100 }, crops: [{ slug: "tomate", quantity: 10 }] }));
	assert.equal(a.crops[0].quantity, 10);
	assert.equal(a.usedPct, 153);
	assert.deepEqual(a.warnings, ["ocupa 153% do espaço disponível"]);
});

test("à sombra, o tomate sai com o motivo e a hortelã fica", () => {
	const a = allocate(input({ light: "sombra", crops: [{ slug: "tomate" }, { slug: "hortela" }] }));
	assert.deepEqual(a.excluded, [{ slug: "tomate", reason: "precisa de sol pleno (6 h ou mais)" }]);
	assert.deepEqual(a.crops.map((c) => c.slug), ["hortela"]);
});

test("espaço mínimo dá pelo menos 1 planta por cultura escolhida", () => {
	const a = allocate(input({ space: { kind: "vasos", widthCm: 30, lengthCm: 30 }, crops: [{ slug: "abobora" }] }));
	assert.equal(a.crops[0].quantity, 1);
	assert.ok(a.usedPct > 100);
});

test("cultura sem planta à venda passa a semente", () => {
	const a = allocate(input({ crops: [{ slug: "rucula", from: "planta" }] }));
	assert.equal(a.crops[0].from, "semente");
});

test("slug que saiu do catálogo não rebenta: fica em excluded", () => {
	const a = allocate(input({ crops: [{ slug: "tomate" }, { slug: "bananeira" }] }));
	assert.deepEqual(a.excluded, [{ slug: "bananeira", reason: "já não existe no catálogo" }]);
	assert.deepEqual(a.crops.map((c) => c.slug), ["tomate"]);
});
