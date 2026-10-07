import type { Crop, PriceRange, Supply, Zone, ZoneClimate } from "./types.ts";

// ponytail: preços são estimativas de referência (out/2026), não recolha em loja.
// A recolha real em 4–6 lojas é a Fase 1 do PRD; até lá a UI diz "estimativa".
const p = (min: number, max: number): PriceRange => ({ min, max, store: "estimativa Growzy", checkedAt: "2026-10" });

// Fontes: Kc — FAO-56 (Allen et al., 1998), tabela 12, fase intermédia.
// Espaçamento, rendimento e meses (litoral-norte) — guias públicos de horticultura; a rever por alguém da área antes do lançamento.
// daysToHarvest conta a partir da plantação (transplante, ou sementeira direta quando não há transplante).
// minPotL = litros de substrato por planta.
export const CROPS: Crop[] = [
	{ slug: "tomate", name: "Tomate", light: "sol", season: "quente", spacingCm: 50, minPotL: 20, kc: 1.15, sowMonths: [2, 3, 4], transplantMonths: [4, 5], daysToHarvest: [70, 90], maxUseful: 6, yieldKg: [2, 4], marketEurKg: 2.2, price: { planta: p(0.8, 1.5), semente: p(1.5, 2.5) }, seedsPerPacket: 50 },
	{ slug: "tomate-cereja", name: "Tomate-cereja", light: "sol", season: "quente", spacingCm: 45, minPotL: 15, kc: 1.1, sowMonths: [2, 3, 4], transplantMonths: [4, 5], daysToHarvest: [60, 80], maxUseful: 4, yieldKg: [1.5, 3], marketEurKg: 5, price: { planta: p(0.9, 1.6), semente: p(1.5, 2.5) }, seedsPerPacket: 50 },
	{ slug: "pimento", name: "Pimento", light: "sol", season: "quente", spacingCm: 40, minPotL: 10, kc: 1.05, sowMonths: [2, 3], transplantMonths: [4, 5], daysToHarvest: [70, 90], maxUseful: 4, yieldKg: [0.8, 1.5], marketEurKg: 3, price: { planta: p(0.8, 1.5), semente: p(1.5, 2.5) }, seedsPerPacket: 50 },
	{ slug: "malagueta", name: "Malagueta", light: "sol", season: "quente", spacingCm: 35, minPotL: 5, kc: 1.05, sowMonths: [2, 3], transplantMonths: [4, 5], daysToHarvest: [80, 100], maxUseful: 2, yieldKg: [0.3, 0.6], marketEurKg: 8, price: { planta: p(1, 2), semente: p(1.5, 2.5) }, seedsPerPacket: 30 },
	{ slug: "beringela", name: "Beringela", light: "sol", season: "quente", spacingCm: 50, minPotL: 15, kc: 1.05, sowMonths: [2, 3], transplantMonths: [5], daysToHarvest: [80, 100], maxUseful: 3, yieldKg: [1.5, 3], marketEurKg: 2.5, price: { planta: p(0.9, 1.6), semente: p(1.5, 2.5) }, seedsPerPacket: 50 },
	{ slug: "curgete", name: "Curgete", light: "sol", season: "quente", spacingCm: 80, minPotL: 40, kc: 1, sowMonths: [4, 5, 6], transplantMonths: [5, 6], daysToHarvest: [45, 60], maxUseful: 2, yieldKg: [3, 6], marketEurKg: 1.8, price: { planta: p(1, 1.8), semente: p(1.8, 2.8) }, seedsPerPacket: 20 },
	{ slug: "pepino", name: "Pepino", light: "sol", season: "quente", spacingCm: 40, minPotL: 15, kc: 1, sowMonths: [4, 5], transplantMonths: [5, 6], daysToHarvest: [55, 70], maxUseful: 3, yieldKg: [2, 4], marketEurKg: 1.6, price: { planta: p(0.9, 1.5), semente: p(1.5, 2.5) }, seedsPerPacket: 30 },
	{ slug: "abobora", name: "Abóbora", light: "sol", season: "quente", spacingCm: 120, minPotL: 40, kc: 1, sowMonths: [4, 5], transplantMonths: [5, 6], daysToHarvest: [90, 120], maxUseful: 2, yieldKg: [4, 8], marketEurKg: 1.5, price: { planta: p(1, 1.8), semente: p(1.5, 2.5) }, seedsPerPacket: 15 },
	{ slug: "feijao-verde", name: "Feijão-verde", light: "sol", season: "quente", spacingCm: 15, minPotL: 1.5, kc: 1.05, sowMonths: [4, 5, 6, 7], transplantMonths: [], daysToHarvest: [60, 75], maxUseful: 30, yieldKg: [0.2, 0.4], marketEurKg: 4, price: { planta: null, semente: p(1.5, 2.5) }, seedsPerPacket: 80 },
	{ slug: "ervilha", name: "Ervilha", light: "sol", season: "fresca", spacingCm: 10, minPotL: 1, kc: 1.15, sowMonths: [10, 11, 1, 2], transplantMonths: [], daysToHarvest: [70, 90], maxUseful: 40, yieldKg: [0.1, 0.2], marketEurKg: 6, price: { planta: null, semente: p(1.5, 2.5) }, seedsPerPacket: 100 },
	{ slug: "fava", name: "Fava", light: "sol", season: "fresca", spacingCm: 20, minPotL: 2.5, kc: 1.15, sowMonths: [10, 11, 12], transplantMonths: [], daysToHarvest: [120, 150], maxUseful: 20, yieldKg: [0.3, 0.5], marketEurKg: 3.5, price: { planta: null, semente: p(1.5, 2.5) }, seedsPerPacket: 40 },
	{ slug: "alface", name: "Alface", light: "meia-sombra", season: "fresca", spacingCm: 25, minPotL: 2, kc: 1, sowMonths: [1, 2, 3, 4, 8, 9, 10], transplantMonths: [2, 3, 4, 5, 9, 10, 11], daysToHarvest: [45, 60], maxUseful: 12, yieldKg: [0.3, 0.4], marketEurKg: 2.5, price: { planta: p(0.15, 0.3), semente: p(1.2, 2) }, seedsPerPacket: 500 },
	{ slug: "rucula", name: "Rúcula", light: "meia-sombra", season: "fresca", spacingCm: 10, minPotL: 0.5, kc: 1, sowMonths: [2, 3, 4, 9, 10], transplantMonths: [], daysToHarvest: [30, 40], maxUseful: 30, yieldKg: [0.05, 0.1], marketEurKg: 12, price: { planta: null, semente: p(1.2, 2) }, seedsPerPacket: 500 },
	{ slug: "espinafre", name: "Espinafre", light: "meia-sombra", season: "fresca", spacingCm: 15, minPotL: 1, kc: 1, sowMonths: [2, 3, 9, 10, 11], transplantMonths: [], daysToHarvest: [40, 50], maxUseful: 20, yieldKg: [0.1, 0.2], marketEurKg: 6, price: { planta: null, semente: p(1.2, 2) }, seedsPerPacket: 300 },
	{ slug: "acelga", name: "Acelga", light: "meia-sombra", season: "fresca", spacingCm: 30, minPotL: 10, kc: 1.05, sowMonths: [3, 4, 8, 9], transplantMonths: [4, 5, 9, 10], daysToHarvest: [50, 60], maxUseful: 6, yieldKg: [1, 2], marketEurKg: 3, price: { planta: p(0.2, 0.4), semente: p(1.2, 2) }, seedsPerPacket: 200 },
	{ slug: "couve", name: "Couve-coração", light: "sol", season: "fresca", spacingCm: 45, minPotL: 20, kc: 1.05, sowMonths: [1, 2, 8, 9], transplantMonths: [3, 4, 10, 11], daysToHarvest: [80, 100], maxUseful: 6, yieldKg: [1, 1.5], marketEurKg: 1.5, price: { planta: p(0.2, 0.4), semente: p(1.2, 2) }, seedsPerPacket: 200 },
	{ slug: "couve-galega", name: "Couve-galega", light: "sol", season: "fresca", spacingCm: 50, minPotL: 20, kc: 1.05, sowMonths: [7, 8, 9], transplantMonths: [9, 10], daysToHarvest: [70, 90], maxUseful: 4, yieldKg: [1.5, 3], marketEurKg: 2.5, price: { planta: p(0.2, 0.4), semente: p(1.2, 2) }, seedsPerPacket: 200 },
	{ slug: "rabanete", name: "Rabanete", light: "meia-sombra", season: "fresca", spacingCm: 5, minPotL: 0.3, kc: 0.9, sowMonths: [2, 3, 4, 5, 9, 10], transplantMonths: [], daysToHarvest: [25, 30], maxUseful: 40, yieldKg: [0.02, 0.03], marketEurKg: 4, price: { planta: null, semente: p(1.2, 2) }, seedsPerPacket: 300 },
	{ slug: "cenoura", name: "Cenoura", light: "sol", season: "fresca", spacingCm: 5, minPotL: 0.5, kc: 1.05, sowMonths: [2, 3, 4, 5, 8, 9], transplantMonths: [], daysToHarvest: [70, 90], maxUseful: 60, yieldKg: [0.05, 0.08], marketEurKg: 1.2, price: { planta: null, semente: p(1.2, 2) }, seedsPerPacket: 500 },
	{ slug: "beterraba", name: "Beterraba", light: "sol", season: "fresca", spacingCm: 10, minPotL: 1, kc: 1.05, sowMonths: [3, 4, 5, 8, 9], transplantMonths: [], daysToHarvest: [60, 80], maxUseful: 30, yieldKg: [0.15, 0.25], marketEurKg: 2, price: { planta: null, semente: p(1.2, 2) }, seedsPerPacket: 150 },
	{ slug: "cebola", name: "Cebola", light: "sol", season: "fresca", spacingCm: 10, minPotL: 0.5, kc: 1.05, sowMonths: [9, 10, 11], transplantMonths: [11, 12, 1], daysToHarvest: [120, 150], maxUseful: 40, yieldKg: [0.1, 0.2], marketEurKg: 1.3, price: { planta: p(0.05, 0.1), semente: p(1.2, 2) }, seedsPerPacket: 300 },
	// "semente" do alho = uma cabeça (~12 dentes)
	{ slug: "alho", name: "Alho", light: "sol", season: "fresca", spacingCm: 12, minPotL: 0.5, kc: 1, sowMonths: [10, 11, 12, 1], transplantMonths: [], daysToHarvest: [180, 220], maxUseful: 40, yieldKg: [0.04, 0.06], marketEurKg: 6, price: { planta: null, semente: p(2, 3) }, seedsPerPacket: 12 },
	{ slug: "alho-frances", name: "Alho-francês", light: "sol", season: "fresca", spacingCm: 15, minPotL: 1, kc: 1, sowMonths: [2, 3, 4], transplantMonths: [5, 6, 7], daysToHarvest: [100, 130], maxUseful: 15, yieldKg: [0.2, 0.3], marketEurKg: 2.5, price: { planta: p(0.08, 0.15), semente: p(1.2, 2) }, seedsPerPacket: 200 },
	{ slug: "morango", name: "Morango", light: "meia-sombra", season: "fresca", spacingCm: 30, minPotL: 2, kc: 0.85, sowMonths: [], transplantMonths: [3, 10, 11], daysToHarvest: [60, 90], maxUseful: 12, yieldKg: [0.2, 0.4], marketEurKg: 6, price: { planta: p(1, 2), semente: p(2, 3) }, seedsPerPacket: 20, perennial: true },
	{ slug: "manjericao", name: "Manjericão", light: "sol", season: "quente", spacingCm: 25, minPotL: 2, kc: 1, sowMonths: [3, 4, 5], transplantMonths: [5, 6], daysToHarvest: [40, 60], maxUseful: 4, yieldKg: [0.1, 0.2], marketEurKg: 20, price: { planta: p(1.2, 2.5), semente: p(1.2, 2) }, seedsPerPacket: 200 },
	{ slug: "salsa", name: "Salsa", light: "meia-sombra", season: "fresca", spacingCm: 20, minPotL: 1.5, kc: 1, sowMonths: [2, 3, 4, 9], transplantMonths: [4, 5, 10], daysToHarvest: [60, 80], maxUseful: 4, yieldKg: [0.1, 0.2], marketEurKg: 15, price: { planta: p(1, 2), semente: p(1.2, 2) }, seedsPerPacket: 300 },
	{ slug: "coentros", name: "Coentros", light: "meia-sombra", season: "fresca", spacingCm: 15, minPotL: 0.7, kc: 1, sowMonths: [2, 3, 4, 9, 10], transplantMonths: [], daysToHarvest: [40, 55], maxUseful: 6, yieldKg: [0.05, 0.1], marketEurKg: 15, price: { planta: null, semente: p(1.2, 2) }, seedsPerPacket: 200 },
	{ slug: "hortela", name: "Hortelã", light: "sombra", season: "fresca", spacingCm: 30, minPotL: 5, kc: 1, sowMonths: [], transplantMonths: [3, 4, 5, 9, 10], daysToHarvest: [60, 90], maxUseful: 2, yieldKg: [0.2, 0.4], marketEurKg: 15, price: { planta: p(1, 2), semente: p(1.5, 2.5) }, seedsPerPacket: 200, perennial: true },
	{ slug: "cebolinho", name: "Cebolinho", light: "meia-sombra", season: "fresca", spacingCm: 15, minPotL: 1, kc: 1, sowMonths: [3, 4, 9], transplantMonths: [5, 10], daysToHarvest: [60, 80], maxUseful: 4, yieldKg: [0.05, 0.1], marketEurKg: 20, price: { planta: p(1, 2), semente: p(1.2, 2) }, seedsPerPacket: 300, perennial: true },
	{ slug: "alecrim", name: "Alecrim", light: "sol", season: "quente", spacingCm: 50, minPotL: 10, kc: 0.7, sowMonths: [], transplantMonths: [3, 4, 10], daysToHarvest: [90, 120], maxUseful: 1, yieldKg: [0.1, 0.2], marketEurKg: 25, price: { planta: p(1.5, 3), semente: p(1.5, 2.5) }, seedsPerPacket: 100, perennial: true },
	{ slug: "tomilho", name: "Tomilho", light: "sol", season: "quente", spacingCm: 25, minPotL: 2, kc: 0.7, sowMonths: [], transplantMonths: [3, 4, 10], daysToHarvest: [80, 100], maxUseful: 2, yieldKg: [0.05, 0.1], marketEurKg: 30, price: { planta: p(1.5, 3), semente: p(1.5, 2.5) }, seedsPerPacket: 200, perennial: true },
];

export const SUPPLIES: Supply[] = [
	{ slug: "vaso-3l", name: "Vaso 3 L", group: "recipientes", durable: true, volumeL: 3, diameterCm: 18, price: p(1, 2) },
	{ slug: "vaso-10l", name: "Vaso 10 L", group: "recipientes", durable: true, volumeL: 10, diameterCm: 26, price: p(2.5, 5) },
	{ slug: "vaso-20l", name: "Vaso 20 L", group: "recipientes", durable: true, volumeL: 20, diameterCm: 35, price: p(5, 10) },
	{ slug: "vaso-40l", name: "Vaso 40 L", group: "recipientes", durable: true, volumeL: 40, diameterCm: 45, price: p(10, 20) },
	{ slug: "floreira-80", name: "Floreira 80 cm", group: "recipientes", durable: true, volumeL: 18, price: p(6, 12) },
	{ slug: "substrato-50l", name: "Substrato universal 50 L", group: "recipientes", durable: false, price: p(5, 9) },
	{ slug: "composto-50l", name: "Composto orgânico 50 L", group: "recipientes", durable: false, price: p(6, 10) },
	{ slug: "pa-mao", name: "Pá de mão", group: "ferramentas", durable: true, price: p(3, 7) },
	{ slug: "luvas", name: "Luvas de jardinagem", group: "ferramentas", durable: true, price: p(2, 5) },
	{ slug: "regador", name: "Regador", group: "rega", durable: true, price: p(5, 12) },
	{ slug: "kit-gota-base", name: "Kit gota-a-gota (temporizador e tubo)", group: "rega", durable: true, price: p(25, 45) },
	{ slug: "gotejador", name: "Gotejador 2 L/h", group: "rega", durable: true, price: p(0.2, 0.5) },
];

// Normais climatológicas 1971–2000, IPMA (valores aproximados, a confirmar na revisão do catálogo).
export const CLIMATE: Record<Zone, ZoneClimate> = {
	"litoral-norte": {
		station: "Porto",
		latitude: 41.2,
		months: [
			{ tMin: 5.2, tMax: 13.8, precipMm: 158 },
			{ tMin: 5.8, tMax: 14.6, precipMm: 129 },
			{ tMin: 7.0, tMax: 16.9, precipMm: 92 },
			{ tMin: 8.4, tMax: 18.0, precipMm: 113 },
			{ tMin: 10.8, tMax: 20.3, precipMm: 96 },
			{ tMin: 13.3, tMax: 23.5, precipMm: 47 },
			{ tMin: 14.9, tMax: 25.1, precipMm: 20 },
			{ tMin: 14.7, tMax: 25.2, precipMm: 31 },
			{ tMin: 13.5, tMax: 24.0, precipMm: 79 },
			{ tMin: 11.0, tMax: 20.6, precipMm: 152 },
			{ tMin: 8.0, tMax: 16.7, precipMm: 166 },
			{ tMin: 6.5, tMax: 14.5, precipMm: 195 },
		],
	},
	interior: {
		station: "Castelo Branco",
		latitude: 39.8,
		months: [
			{ tMin: 3.6, tMax: 12.3, precipMm: 102 },
			{ tMin: 4.6, tMax: 14.2, precipMm: 85 },
			{ tMin: 6.4, tMax: 17.6, precipMm: 52 },
			{ tMin: 8.3, tMax: 19.2, precipMm: 73 },
			{ tMin: 11.0, tMax: 23.3, precipMm: 63 },
			{ tMin: 14.8, tMax: 28.9, precipMm: 24 },
			{ tMin: 17.2, tMax: 32.9, precipMm: 9 },
			{ tMin: 17.1, tMax: 32.5, precipMm: 8 },
			{ tMin: 15.2, tMax: 28.4, precipMm: 36 },
			{ tMin: 11.4, tMax: 21.8, precipMm: 86 },
			{ tMin: 7.0, tMax: 16.0, precipMm: 99 },
			{ tMin: 5.0, tMax: 12.8, precipMm: 121 },
		],
	},
	sul: {
		station: "Faro",
		latitude: 37.0,
		months: [
			{ tMin: 8.4, tMax: 16.1, precipMm: 70 },
			{ tMin: 9.2, tMax: 16.9, precipMm: 52 },
			{ tMin: 10.6, tMax: 19.0, precipMm: 33 },
			{ tMin: 11.8, tMax: 20.4, precipMm: 36 },
			{ tMin: 14.0, tMax: 23.0, precipMm: 19 },
			{ tMin: 17.0, tMax: 26.5, precipMm: 6 },
			{ tMin: 19.2, tMax: 29.0, precipMm: 1 },
			{ tMin: 19.4, tMax: 29.1, precipMm: 3 },
			{ tMin: 18.1, tMax: 27.0, precipMm: 15 },
			{ tMin: 15.4, tMax: 23.6, precipMm: 59 },
			{ tMin: 12.0, tMax: 19.7, precipMm: 80 },
			{ tMin: 9.9, tMax: 17.2, precipMm: 99 },
		],
	},
};

export const cropBySlug = new Map(CROPS.map((c) => [c.slug, c]));
export const supplyBySlug = new Map(SUPPLIES.map((s) => [s.slug, s]));
