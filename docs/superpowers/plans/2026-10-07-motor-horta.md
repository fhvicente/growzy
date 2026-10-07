# Motor espaço → horta: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A pessoa dá as medidas, a luz, a zona e as culturas. A Growzy devolve quantas plantas cabem, a lista de compras e o custo, a rega por mês, o calendário e a poupança, com o que é do Standard retirado no servidor.

**Architecture:** O motor é um conjunto de funções puras em `src/lib/garden/`, com um catálogo versionado em git. Corre só no servidor (`POST /api/garden/plan`), e o resultado é filtrado pelo plano em `redactForPlan`. As hortas guardam só o input (tabela `gardens`) e são recalculadas sempre que se abrem. A UI chama a API com um debounce de 300 ms.

**Tech Stack:** Next 16 (App Router), React 19, Drizzle + Postgres, zod 4, Tailwind 4 (tokens em `src/app/globals.css`), `node --test` com TypeScript nativo do Node 25.

**Spec:** `docs/superpowers/specs/2026-10-07-motor-horta-design.md`

## Global Constraints

- **Sem dependências novas.** Os testes usam `node --test` (Node 25, TypeScript nativo).
- **Imports em `src/lib/garden/`:** são sempre relativos e com a extensão `.ts` (`import { x } from "./catalog.ts"`), nunca `@/`, para correrem com `node --test`. Os tipos importam-se com `import type`.
- **Imports fora de `src/lib/garden/`:** usam `@/lib/garden/<módulo>` sem extensão.
- **Copy:** português europeu, tratamento por "tu", sem prometer features que não existem.
- **Cores:** só os tokens da marca (`bg-card`, `text-ink`, `text-ink-soft`, `bg-moss`, `text-paper`, `border-line`, `bg-paper-2`, `bg-tomato`, `text-tomato-deep`, `text-destructive`). Proibido: `bg-white`, `gray-*`, `green-*`, `blue-*`, `red-*`.
- **Mobile primeiro:** tem de funcionar a 360 px de largura.
- **Respostas da API:** `{ ok: true, data }` ou `{ ok: false, error }`. 401 sem sessão. Uma horta de outra pessoa dá 404.
- **O gating por plano só existe no servidor.** Os dados do Standard nunca chegam ao browser de um utilizador Grátis.
- **Commits sem `Co-Authored-By`** nem qualquer atribuição ao Claude.
- **Não mexer** em `scripts/migrate-sqlite-to-postgres.ts` (está fora do `tsconfig`) nem em `PRD-todo.md`.
- **Servidor de desenvolvimento:** já está a correr em `http://localhost:3000` (é do utilizador). Usa-o para testes de fumo e não arranques outro. Se não responder, arranca com `npm run dev -- -p 3000` em background e mata-o no fim.

## Review Focus

- **Medidas a meio da edição** (campo vazio, "0", "5"): o cliente não pode chamar a API e mostra "As medidas vão de 30 a 2000 cm". O servidor rejeita com 400. Coberto em Task 3 (schema) e Task 7 (passo de verificação).
- **Hortas guardadas com um slug que entretanto saiu do catálogo:** abrir a horta não pode rebentar. A cultura aparece em `excluded` com "já não existe no catálogo". Coberto pelo teste de `allocate` em Task 1.
- **Duplo clique em "já tenho"** (dois PATCH seguidos): o segundo não pode desfazer o primeiro. O estado `owned` é local no cliente (Task 8).
- **Utilizador Grátis com 3 hortas a carregar "Guardar" outra vez:** recebe 403 com uma mensagem legível e um link para os planos, não uma falha silenciosa. Coberto em Task 5 (smoke) e Task 7 (UI).
- **Mudança de mês em Lisboa vs UTC:** "este mês" usa `Europe/Lisbon`. Coberto pelo teste de `lisbonMonth` em Task 3.

---

## Ficheiros

| Ficheiro | Responsabilidade |
| --- | --- |
| `src/lib/garden/types.ts` | Tipos do input, do catálogo e do resultado |
| `src/lib/garden/catalog.ts` | `CROPS`, `SUPPLIES`, `CLIMATE` e mapas por slug |
| `src/lib/garden/money.ts` | `round2`, `range` |
| `src/lib/garden/allocate.ts` | Filtro de luz, encaixe em recipientes, distribuição |
| `src/lib/garden/shopping.ts` | Lista de compras e totais |
| `src/lib/garden/calendar.ts` | Meses por zona, colheita, meses ativos, próximo passo |
| `src/lib/garden/watering.ts` | Ra, ET0 de Hargreaves, rega por cultura e mês |
| `src/lib/garden/savings.ts` | Valor da colheita, poupança e payback |
| `src/lib/garden/plan.ts` | `planGarden`, `lisbonMonth` |
| `src/lib/garden/redact.ts` | `redactForPlan`, `PlanView` |
| `src/lib/garden/schema.ts` | `gardenInputSchema`, `gardenBodySchema` (zod) |
| `src/lib/garden/fixtures.ts` + `*.test.ts` | Testes |
| `src/lib/garden-view.ts` | `gardenView(input, userId)`, `getUserGarden(id, userId)` (usam a BD) |
| `src/lib/plans.ts` | Só as features que existem + `PLAN_COPY` |
| `src/lib/plan-limits.ts` | Só `getUserPlan` |
| `src/lib/schema.ts` | `gardens` em vez de `calculations`, `plants` e `products` |
| `src/app/api/garden/plan/route.ts` | Calcular sem gravar |
| `src/app/api/gardens/route.ts`, `[id]/route.ts` | CRUD de hortas |
| `src/components/garden/garden-report.tsx` | Mostra um `PlanView` (resumo ou completo) |
| `src/components/calculator/calculator-client.tsx` | Formulário e resultado ao vivo (reescrito) |
| `src/components/garden/garden-result-client.tsx` | Talão: "já tenho", editar, apagar |
| Páginas `calculator`, `calculator/result/[id]`, `dashboard`, `pricing`, landing `pricing-section` | UI |

**Apagados:** `src/app/api/calculator/` (todas as rotas), `src/app/api/calculations/`, `src/app/api/dashboard/summary/`, `src/app/api/user/plan-info/` e `src/components/plan-display.tsx`. Nenhum tem consumidores além de si próprio (confirmado com grep). A spec dizia para "atualizar" `plan-display` e `plan-info`; como não são usados, apagam-se.

**Diferença em relação à spec:** a necessidade de água por planta usa a área de copa (`spacingCm²`), e não a pegada do vaso. A rega só inclui as culturas que estão na horta nesse mês (`cropMonths().active`); as perenes (`perennial: true`) contam o ano inteiro. Sem isto, a app mandava regar tomate em janeiro.

---

### Task 0: Branch e configuração de testes

**Files:**
- Modify: `tsconfig.json` (compilerOptions)
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `npm test` corre `node --test src/lib/garden`; o `tsc` aceita imports com `.ts`.

- [ ] **Step 1: Criar o branch** (se ainda não existir)

```bash
git switch -c feat/motor-horta
```

Nota: há alterações por fazer em `package.json` (script `db:studio`), em `src/app/[locale]/(protected)/dashboard/page.tsx` (WIP que a Task 8 substitui) e em `tsconfig.tsbuildinfo`. Ficam no working tree. O `package.json` entra no commit desta task. Não faças commit do `tsbuildinfo`.

- [ ] **Step 2: Em `tsconfig.json`, acrescentar a seguir a `"isolatedModules": true,`**

```json
		"allowImportingTsExtensions": true,
```

- [ ] **Step 3: Em `package.json`, nos `scripts`, acrescentar a seguir a `"lint"`**

```json
		"test": "node --test src/lib/garden",
```

- [ ] **Step 4: Confirmar** que `npx tsc --noEmit` dá os mesmos erros que antes (os 3 erros conhecidos do Stripe `apiVersion` em `src/app/api/stripe/webhook`, `subscription/checkout` e `subscription/success`). Não corrigir esses erros: estão fora de âmbito.

Run: `npx tsc --noEmit 2>&1 | grep -c "error TS"`
Expected: `3` (ou o número que já existia antes desta task, e nunca mais)

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json package.json
git commit -m "chore: node --test para src/lib/garden"
```

---

### Task 1: Tipos, catálogo, distribuição e lista de compras

**Files:**
- Create: `src/lib/garden/types.ts`, `src/lib/garden/catalog.ts`, `src/lib/garden/money.ts`, `src/lib/garden/allocate.ts`, `src/lib/garden/shopping.ts`, `src/lib/garden/fixtures.ts`
- Test: `src/lib/garden/allocate.test.ts`, `src/lib/garden/shopping.test.ts`

**Interfaces:**
- Produces:
  - `types.ts`: todos os tipos (`GardenInput`, `Crop`, `Supply`, `Allocation`, `AllocatedCrop`, `Shopping`, `ShoppingLine`, `Range`, `MonthWatering`, `CropWatering`, `Calendar`, `CropCalendar`, `Savings`, `GardenResult`, `Zone`, `Light`, `SpaceKind`, `From`, `PriceRange`, `ZoneClimate`, `MonthClimate`, `SupplyGroup`)
  - `catalog.ts`: `CROPS: Crop[]`, `SUPPLIES: Supply[]`, `CLIMATE: Record<Zone, ZoneClimate>`, `cropBySlug: Map<string, Crop>`, `supplyBySlug: Map<string, Supply>`
  - `money.ts`: `round2(n)`, `range(min, max): Range`
  - `allocate.ts`: `lightOk(crop, light): boolean`, `fit(crop, kind)`, `allocate(input): Allocation`
  - `shopping.ts`: `shoppingList(input, allocation): Shopping`
  - `fixtures.ts`: `input(over?): GardenInput`. Por defeito: litoral-norte, vasos 200×100, sol, regador, tomate e manjericão.

- [ ] **Step 1: Criar `src/lib/garden/types.ts`**

`src/lib/garden/types.ts`:

```ts
export type Zone = "litoral-norte" | "interior" | "sul";
export type Light = "sol" | "meia-sombra" | "sombra";
export type SpaceKind = "vasos" | "canteiro-elevado" | "terra";
export type From = "planta" | "semente";

export type GardenInput = {
	zone: Zone;
	space: { kind: SpaceKind; widthCm: number; lengthCm: number };
	light: Light;
	irrigation: "regador" | "gota-a-gota";
	crops: { slug: string; quantity?: number; from?: From }[];
	owned: string[];
};

export type PriceRange = { min: number; max: number; store: string; checkedAt: string };

export type Crop = {
	slug: string;
	name: string;
	light: Light; // luz mínima
	season: "quente" | "fresca";
	spacingCm: number;
	minPotL: number; // litros de substrato por planta
	kc: number; // FAO-56, fase intermédia
	sowMonths: number[]; // 1–12, zona litoral-norte
	transplantMonths: number[]; // [] = sementeira direta
	daysToHarvest: [number, number]; // desde a plantação
	maxUseful: number;
	yieldKg: [number, number]; // por planta, por época
	marketEurKg: number;
	price: { planta: PriceRange | null; semente: PriceRange };
	seedsPerPacket: number;
	perennial?: true; // fica na horta o ano inteiro
};

export type SupplyGroup = "plantas" | "recipientes" | "ferramentas" | "rega";

export type Supply = {
	slug: string;
	name: string;
	group: SupplyGroup;
	durable: boolean;
	price: PriceRange;
	volumeL?: number;
	diameterCm?: number;
};

export type MonthClimate = { tMin: number; tMax: number; precipMm: number };
export type ZoneClimate = { station: string; latitude: number; months: MonthClimate[] };

export type Range = { min: number; max: number; mid: number };

export type AllocatedCrop = {
	slug: string;
	from: From;
	quantity: number;
	footprintCm2: number;
	container: string | null; // slug de SUPPLIES ou null (canteiro/terra)
	perContainer: number; // plantas por recipiente (1 em vaso, n em floreira)
	potLPerPlant: number; // litros de substrato por planta
};

export type Allocation = {
	crops: AllocatedCrop[];
	excluded: { slug: string; reason: string }[];
	usableCm2: number;
	usedPct: number;
	warnings: string[];
};

export type ShoppingLine = {
	slug: string;
	name: string;
	group: SupplyGroup;
	quantity: number;
	unit: string;
	durable: boolean;
	owned: boolean;
	min: number;
	max: number;
	store: string;
	checkedAt: string;
};

export type Shopping = { lines: ShoppingLine[]; total: Range; durableTotal: Range };

export type CropWatering = {
	slug: string;
	litersPerDay: number;
	everyDays: number | null; // null = a chuva chega
	litersPerWatering: number;
	dripMinutes: number | null;
};

export type MonthWatering = {
	month: number;
	et0: number;
	crops: CropWatering[];
	litersPerWeek: number;
	hint: string;
	timer: { everyDays: number; minutes: number } | null;
};

export type CropCalendar = {
	slug: string;
	sow: number[];
	transplant: number[];
	harvest: number[];
	next: { action: "semear" | "transplantar"; month: number } | null;
};

export type Calendar = {
	crops: CropCalendar[];
	months: { month: number; sow: string[]; transplant: string[]; harvest: string[] }[];
};

export type Savings = {
	harvestValue: Range;
	firstSeason: Range;
	nextSeason: Range;
	paybackWeeks: number | null;
	verdict: "paga-se na 1.ª época" | "paga-se na 2.ª época" | "não compensa financeiramente";
	byCrop: { slug: string; min: number; max: number }[];
};

export type GardenResult = {
	allocation: Allocation;
	shopping: Shopping;
	watering: MonthWatering[];
	calendar: Calendar;
	savings: Savings;
};
```

- [ ] **Step 2: Criar `src/lib/garden/catalog.ts`.** Copia os dados exatamente como estão, porque os testes dependem destes valores.

`src/lib/garden/catalog.ts`:

```ts
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
```

- [ ] **Step 3: Criar `src/lib/garden/money.ts` e `src/lib/garden/fixtures.ts`**

`src/lib/garden/money.ts`:

```ts
import type { Range } from "./types.ts";

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const range = (min: number, max: number): Range => ({ min: round2(min), max: round2(max), mid: round2((min + max) / 2) });
```

`src/lib/garden/fixtures.ts`:

```ts
import type { GardenInput } from "./types.ts";

export const input = (over: Partial<GardenInput> = {}): GardenInput => ({
	zone: "litoral-norte",
	space: { kind: "vasos", widthCm: 200, lengthCm: 100 },
	light: "sol",
	irrigation: "regador",
	crops: [{ slug: "tomate" }, { slug: "manjericao" }],
	owned: [],
	...over,
});
```

- [ ] **Step 4: Escrever os testes `src/lib/garden/allocate.test.ts` e `src/lib/garden/shopping.test.ts`.** O último teste de allocate cobre uma horta guardada com um slug que saiu do catálogo (Review Focus).

`src/lib/garden/allocate.test.ts`:

```ts
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
```

`src/lib/garden/shopping.test.ts`:

```ts
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
```

- [ ] **Step 5: Correr os testes para confirmar que falham**

Run: `node --test src/lib/garden`
Expected: FAIL com `Cannot find module '.../allocate.ts'`

- [ ] **Step 6: Implementar `src/lib/garden/allocate.ts` e `src/lib/garden/shopping.ts`**

`src/lib/garden/allocate.ts`:

```ts
import { cropBySlug, SUPPLIES } from "./catalog.ts";
import type { AllocatedCrop, Allocation, Crop, GardenInput, Light, SpaceKind } from "./types.ts";

const LIGHT_RANK: Record<Light, number> = { sombra: 0, "meia-sombra": 1, sol: 2 };
const POTS = SUPPLIES.filter((s) => s.slug.startsWith("vaso-")); // já ordenados por volume
const FLOREIRA_L = 18;

export const lightOk = (crop: Crop, light: Light) => LIGHT_RANK[light] >= LIGHT_RANK[crop.light];

type Fit = Pick<AllocatedCrop, "footprintCm2" | "container" | "perContainer" | "potLPerPlant">;

export function fit(crop: Crop, kind: SpaceKind): Fit {
	if (kind !== "vasos") {
		return { footprintCm2: crop.spacingCm ** 2, container: null, perContainer: 1, potLPerPlant: 0 };
	}
	if (crop.spacingCm <= 25) {
		const per = Math.max(1, Math.min(Math.floor(80 / crop.spacingCm), Math.floor(FLOREIRA_L / crop.minPotL)));
		return { footprintCm2: (80 * 20) / per, container: "floreira-80", perContainer: per, potLPerPlant: FLOREIRA_L / per };
	}
	const pot = POTS.find((v) => (v.volumeL ?? 0) >= crop.minPotL) ?? POTS[POTS.length - 1];
	return { footprintCm2: (pot.diameterCm ?? 0) ** 2, container: pot.slug, perContainer: 1, potLPerPlant: pot.volumeL ?? 0 };
}

export function allocate(input: GardenInput): Allocation {
	const { kind, widthCm, lengthCm } = input.space;
	const usableCm2 = widthCm * lengthCm * (kind === "vasos" ? 0.8 : 1);
	const excluded: Allocation["excluded"] = [];
	const rows: (AllocatedCrop & { crop: Crop; auto: boolean })[] = [];

	for (const item of input.crops) {
		const crop = cropBySlug.get(item.slug);
		if (!crop) {
			excluded.push({ slug: item.slug, reason: "já não existe no catálogo" });
			continue;
		}
		if (!lightOk(crop, input.light)) {
			excluded.push({
				slug: crop.slug,
				reason: crop.light === "sol" ? "precisa de sol pleno (6 h ou mais)" : "precisa de pelo menos meia-sombra (3 h de sol)",
			});
			continue;
		}
		const from = (item.from ?? "planta") === "planta" && crop.price.planta ? "planta" : "semente";
		rows.push({ slug: crop.slug, from, quantity: item.quantity ?? 0, ...fit(crop, kind), crop, auto: !item.quantity });
	}

	// Área que sobra das quantidades manuais, repartida em partes iguais pelas automáticas.
	// Uma cultura que bate no teto devolve a área que não usa às outras.
	let pool = usableCm2 - rows.filter((r) => !r.auto).reduce((s, r) => s + r.quantity * r.footprintCm2, 0);
	let open = rows.filter((r) => r.auto);
	while (open.length) {
		const share = Math.max(0, pool) / open.length;
		const capped = open.filter((r) => Math.floor(share / r.footprintCm2) >= r.crop.maxUseful);
		if (!capped.length) {
			for (const r of open) r.quantity = Math.floor(share / r.footprintCm2);
			break;
		}
		for (const r of capped) {
			r.quantity = r.crop.maxUseful;
			pool -= r.quantity * r.footprintCm2;
		}
		open = open.filter((r) => !capped.includes(r));
	}
	for (const r of rows) r.quantity = Math.max(1, r.quantity);

	const used = rows.reduce((s, r) => s + r.quantity * r.footprintCm2, 0);
	const usedPct = Math.round((used / usableCm2) * 100);
	const warnings = usedPct > 100 ? [`ocupa ${usedPct}% do espaço disponível`] : [];

	return {
		crops: rows.map(({ crop: _c, auto: _a, ...r }) => r),
		excluded,
		usableCm2,
		usedPct,
		warnings,
	};
}
```

`src/lib/garden/shopping.ts`:

```ts
import { cropBySlug, supplyBySlug } from "./catalog.ts";
import { range, round2 } from "./money.ts";
import type { Allocation, GardenInput, PriceRange, Shopping, ShoppingLine } from "./types.ts";

export function shoppingList(input: GardenInput, allocation: Allocation): Shopping {
	const lines: ShoppingLine[] = [];
	const owned = new Set(input.owned);
	const add = (slug: string, name: string, group: ShoppingLine["group"], quantity: number, unit: string, durable: boolean, price: PriceRange) => {
		if (quantity <= 0) return;
		const isOwned = owned.has(slug);
		lines.push({ slug, name, group, quantity, unit, durable, owned: isOwned, min: round2(price.min * quantity), max: round2(price.max * quantity), store: price.store, checkedAt: price.checkedAt });
	};
	const supply = (slug: string, quantity: number, unit = "un.") => {
		const s = supplyBySlug.get(slug);
		if (s) add(s.slug, s.name, s.group, quantity, unit, s.durable, s.price);
	};

	for (const a of allocation.crops) {
		const crop = cropBySlug.get(a.slug);
		if (!crop) continue;
		if (a.from === "planta" && crop.price.planta) add(crop.slug, crop.name, "plantas", a.quantity, "plantas", false, crop.price.planta);
		else add(crop.slug, `${crop.name} (sementes)`, "plantas", Math.ceil(a.quantity / crop.seedsPerPacket), "pacotes", false, crop.price.semente);
	}

	const { kind, widthCm, lengthCm } = input.space;
	const areaM2 = (widthCm * lengthCm) / 10000;
	if (kind === "vasos") {
		const containers = new Map<string, number>();
		for (const a of allocation.crops) {
			if (a.container) containers.set(a.container, (containers.get(a.container) ?? 0) + Math.ceil(a.quantity / a.perContainer));
		}
		let liters = 0;
		for (const [slug, n] of containers) {
			supply(slug, n);
			liters += n * (supplyBySlug.get(slug)?.volumeL ?? 0);
		}
		supply("substrato-50l", Math.ceil(liters / 50), "sacos");
	} else if (kind === "canteiro-elevado") {
		supply("substrato-50l", Math.ceil((areaM2 * 300) / 50), "sacos");
	} else {
		supply("composto-50l", Math.ceil((areaM2 * 10) / 50), "sacos");
	}

	supply("pa-mao", 1);
	supply("luvas", 1);
	if (input.irrigation === "regador") {
		supply("regador", 1);
	} else {
		supply("kit-gota-base", 1);
		const drippers = kind === "vasos" ? allocation.crops.reduce((s, a) => s + a.quantity, 0) : Math.ceil(areaM2);
		supply("gotejador", drippers);
	}

	const buy = lines.filter((l) => !l.owned);
	const sum = (ls: ShoppingLine[]) => range(ls.reduce((s, l) => s + l.min, 0), ls.reduce((s, l) => s + l.max, 0));
	return { lines, total: sum(buy), durableTotal: sum(buy.filter((l) => l.durable)) };
}
```

- [ ] **Step 7: Correr os testes**

Run: `npm test`
Expected: PASS, 12 testes (7 de allocate, 5 de shopping), 0 a falhar

- [ ] **Step 8: Commit**

```bash
git add src/lib/garden
git commit -m "feat(garden): catálogo, distribuição do espaço e lista de compras"
```

---

### Task 2: Calendário e rega

**Files:**
- Create: `src/lib/garden/calendar.ts`, `src/lib/garden/watering.ts`
- Test: `src/lib/garden/calendar.test.ts`, `src/lib/garden/watering.test.ts`

**Interfaces:**
- Consumes: `cropBySlug`, `CLIMATE` (catalog.ts); `allocate` (allocate.ts); tipos de types.ts; `input()` (fixtures.ts)
- Produces:
  - `calendar.ts`: `cropMonths(crop, zone): { sow: number[]; transplant: number[]; harvest: number[]; active: number[] }`, `calendar(input, allocation, currentMonth): Calendar`
  - `watering.ts`: `extraterrestrialRadiation(latDeg, dayOfYear): number`, `hargreavesEt0(ra, tMin, tMax): number`, `watering(input, allocation): MonthWatering[]` (12 meses; em cada mês, só as culturas ativas)

- [ ] **Step 1: Escrever os testes**

`src/lib/garden/calendar.test.ts`:

```ts
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
```

`src/lib/garden/watering.test.ts`:

```ts
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
```

- [ ] **Step 2: Correr para confirmar que falham**

Run: `npm test`
Expected: FAIL em calendar.test.ts e watering.test.ts (módulo não encontrado); os testes da Task 1 continuam a passar

- [ ] **Step 3: Implementar**

`src/lib/garden/calendar.ts`:

```ts
import { cropBySlug } from "./catalog.ts";
import type { Allocation, Calendar, Crop, CropCalendar, GardenInput, Zone } from "./types.ts";

const wrap = (m: number) => ((((m - 1) % 12) + 12) % 12) + 1;
const ZONE_SHIFT: Record<Zone, number> = { "litoral-norte": 0, interior: 1, sul: -1 };

/** Meses de uma cultura numa zona: semear, transplantar, colher e meses em que está na horta. */
export function cropMonths(crop: Crop, zone: Zone) {
	// ponytail: ajuste de zona de ±1 mês só nas culturas de estação quente (heurística, dita na UI)
	const shift = crop.season === "quente" ? ZONE_SHIFT[zone] : 0;
	const sow = crop.sowMonths.map((m) => wrap(m + shift));
	const transplant = crop.transplantMonths.map((m) => wrap(m + shift));
	const harvest = new Set<number>();
	const active = new Set<number>(crop.perennial ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : sow);
	for (const m of transplant.length ? transplant : sow) {
		const first = Math.floor(crop.daysToHarvest[0] / 30);
		const last = Math.ceil(crop.daysToHarvest[1] / 30);
		for (let k = 0; k <= last; k++) {
			active.add(wrap(m + k));
			if (k >= first) harvest.add(wrap(m + k));
		}
	}
	const sorted = (s: Set<number>) => [...s].sort((x, y) => x - y);
	return { sow, transplant, harvest: sorted(harvest), active: sorted(active) };
}

export function calendar(input: GardenInput, allocation: Allocation, currentMonth: number): Calendar {
	const crops: CropCalendar[] = allocation.crops.flatMap((a) => {
		const crop = cropBySlug.get(a.slug);
		if (!crop) return [];
		const { sow, transplant, harvest } = cropMonths(crop, input.zone);
		const useTransplant = transplant.length > 0 && (a.from === "planta" || sow.length === 0);
		const action = useTransplant ? "transplantar" : "semear";
		const list = useTransplant ? transplant : sow;
		let next: CropCalendar["next"] = null;
		for (let k = 0; k < 12 && !next; k++) {
			const month = wrap(currentMonth + k);
			if (list.includes(month)) next = { action, month };
		}
		return [{ slug: a.slug, sow, transplant, harvest, next }];
	});

	const months = Array.from({ length: 12 }, (_, i) => {
		const month = i + 1;
		return {
			month,
			sow: crops.filter((c) => c.sow.includes(month)).map((c) => c.slug),
			transplant: crops.filter((c) => c.transplant.includes(month)).map((c) => c.slug),
			harvest: crops.filter((c) => c.harvest.includes(month)).map((c) => c.slug),
		};
	});
	return { crops, months };
}
```

`src/lib/garden/watering.ts`:

```ts
import { cropMonths } from "./calendar.ts";
import { CLIMATE, cropBySlug } from "./catalog.ts";
import type { Allocation, GardenInput, Light, MonthWatering } from "./types.ts";

const MID_MONTH_DAY = [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const LIGHT_FACTOR: Record<Light, number> = { sol: 1, "meia-sombra": 0.75, sombra: 0.5 };
const DRIPPER_LH = 2;
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

		// Só as culturas que estão na horta neste mês.
		const present = allocation.crops.flatMap((a) => {
			const crop = cropBySlug.get(a.slug);
			return crop && cropMonths(crop, input.zone).active.includes(i + 1) ? [{ a, crop }] : [];
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
			// Em vaso, um gotejador por planta; em canteiro e terra, um por m².
			const dripLiters = potted ? perWatering : netMm * everyDays;
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
		return {
			month: i + 1,
			et0: round1(et0),
			crops,
			litersPerWeek: round1(weekly),
			hint: hot && potted ? "Rega antes das 9h e, com calor, também ao fim da tarde nos vasos pequenos." : "Rega antes das 9h.",
			timer: scheduled.length
				? { everyDays: Math.min(...scheduled.map((w) => w.everyDays ?? 7)), minutes: Math.max(...scheduled.map((w) => w.dripMinutes ?? 0)) }
				: null,
		};
	});
}
```

- [ ] **Step 4: Correr os testes**

Run: `npm test`
Expected: PASS em tudo

- [ ] **Step 5: Commit**

```bash
git add src/lib/garden
git commit -m "feat(garden): calendário por zona e rega por Hargreaves"
```

---

### Task 3: Poupança, composição, gating e validação

**Files:**
- Create: `src/lib/garden/savings.ts`, `src/lib/garden/plan.ts`, `src/lib/garden/redact.ts`, `src/lib/garden/schema.ts`
- Test: `src/lib/garden/savings.test.ts`, `src/lib/garden/plan.test.ts`

**Interfaces:**
- Consumes: tudo das Tasks 1–2
- Produces:
  - `savings.ts`: `savings(allocation, shopping): Savings`
  - `plan.ts`: `planGarden(input, currentMonth): GardenResult`, `lisbonMonth(date?): number`
  - `redact.ts`: `type PlanAccess = { fullYearWatering; fullYearCalendar; savingsDetail }` (booleans), `type PlanView`, `redactForPlan(result, access, currentMonth): PlanView` (`locked` com as chaves `"watering.year"`, `"calendar.year"` e `"savings.detail"`)
  - `schema.ts`: `gardenInputSchema` (zod; `owned` tem `default([])`), `gardenBodySchema = { name: string trim 1–80, input }`

- [ ] **Step 1: Escrever os testes.** Também cobrem a validação de medidas a meio da edição (Review Focus).

`src/lib/garden/savings.test.ts`:

```ts
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
```

`src/lib/garden/plan.test.ts`:

```ts
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
	assert.equal(lisbonMonth(new Date("2026-07-01T00:30:00Z")), 7); // 01:30 em Lisboa (verão)
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
```

- [ ] **Step 2: Correr para confirmar que falham**

Run: `npm test`
Expected: FAIL nos dois ficheiros novos

- [ ] **Step 3: Implementar**

`src/lib/garden/savings.ts`:

```ts
import { cropBySlug } from "./catalog.ts";
import { range } from "./money.ts";
import type { Allocation, Range, Savings, Shopping } from "./types.ts";

const HARVEST_WEEKS = 8; // ponytail: duração média da colheita, constante; calibrar com colheitas registadas (Fase 2)
const REFILL = 0.3; // fração de substrato/composto a repor por época

const minus = (a: Range, b: Range) => range(a.min - b.max, a.max - b.min);

export function savings(allocation: Allocation, shopping: Shopping): Savings {
	let low = 0;
	let high = 0;
	let weightedDays = 0;
	const byCrop = allocation.crops.flatMap((a) => {
		const crop = cropBySlug.get(a.slug);
		if (!crop) return [];
		const min = a.quantity * crop.yieldKg[0] * crop.marketEurKg;
		const max = a.quantity * crop.yieldKg[1] * crop.marketEurKg;
		low += min;
		high += max;
		weightedDays += ((min + max) / 2) * crop.daysToHarvest[0];
		return [{ slug: a.slug, min: range(min, max).min, max: range(min, max).max }];
	});
	const harvestValue = range(low, high);
	const cost = shopping.total;

	const buy = shopping.lines.filter((l) => !l.owned);
	const refill = (l: (typeof buy)[number]) => (l.group === "plantas" ? 1 : l.slug === "substrato-50l" || l.slug === "composto-50l" ? REFILL : 0);
	const nextCost = range(
		buy.reduce((s, l) => s + l.min * refill(l), 0),
		buy.reduce((s, l) => s + l.max * refill(l), 0),
	);
	const nextSeason = minus(harvestValue, nextCost);

	let paybackWeeks: number | null = null;
	let verdict: Savings["verdict"];
	if (harvestValue.mid > cost.mid && harvestValue.mid > 0) {
		const weeksToHarvest = weightedDays / harvestValue.mid / 7;
		paybackWeeks = Math.round(weeksToHarvest + cost.mid / (harvestValue.mid / HARVEST_WEEKS));
		verdict = "paga-se na 1.ª época";
	} else {
		verdict = nextSeason.mid > 0 ? "paga-se na 2.ª época" : "não compensa financeiramente";
	}

	return { harvestValue, firstSeason: minus(harvestValue, cost), nextSeason, paybackWeeks, verdict, byCrop };
}
```

`src/lib/garden/plan.ts`:

```ts
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
```

`src/lib/garden/redact.ts`:

```ts
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
```

`src/lib/garden/schema.ts`:

```ts
import { z } from "zod";
import { cropBySlug, supplyBySlug } from "./catalog.ts";

const cm = z.number().int().min(30).max(2000);

export const gardenInputSchema = z.object({
	zone: z.enum(["litoral-norte", "interior", "sul"]),
	space: z.object({ kind: z.enum(["vasos", "canteiro-elevado", "terra"]), widthCm: cm, lengthCm: cm }),
	light: z.enum(["sol", "meia-sombra", "sombra"]),
	irrigation: z.enum(["regador", "gota-a-gota"]),
	crops: z
		.array(
			z.object({
				slug: z.string().refine((s) => cropBySlug.has(s), "cultura desconhecida"),
				quantity: z.number().int().min(1).max(200).optional(),
				from: z.enum(["planta", "semente"]).optional(),
			}),
		)
		.min(1)
		.max(15)
		.refine((cs) => new Set(cs.map((c) => c.slug)).size === cs.length, "culturas repetidas"),
	owned: z.array(z.string().refine((s) => supplyBySlug.has(s), "material desconhecido")).max(20).default([]),
});

export const gardenBodySchema = z.object({ name: z.string().trim().min(1).max(80), input: gardenInputSchema });
```

- [ ] **Step 4: Correr os testes e o typecheck**

Run: `npm test && npx tsc --noEmit 2>&1 | grep "src/lib/garden" ; echo "garden tsc errors above (expect none)"`
Expected: os testes passam todos; nenhum erro de tsc em `src/lib/garden`

- [ ] **Step 5: Commit**

```bash
git add src/lib/garden
git commit -m "feat(garden): poupança, gating por plano e validação do input"
```

---

### Task 4: Base de dados, planos e limpeza do modelo antigo

**Files:**
- Modify: `src/lib/schema.ts`, `src/lib/plans.ts`, `src/lib/plan-limits.ts`, `src/app/api/subscription/checkout/route.ts`
- Create: `src/lib/garden-view.ts`, migrações em `drizzle/`
- Delete: `src/app/api/calculator/` (pasta toda), `src/app/api/calculations/`, `src/app/api/dashboard/summary/`, `src/app/api/user/plan-info/`, `src/components/plan-display.tsx`

**Interfaces:**
- Consumes: `GardenInput` (types.ts), `planGarden`, `lisbonMonth` (plan.ts), `redactForPlan`, `PlanView` (redact.ts)
- Produces:
  - `schema.ts`: `gardens` (id serial, userId, name, input `json().$type<GardenInput>()`, createdAt, updatedAt)
  - `plans.ts`: `PLAN_TYPES`, `PlanType`, `PlanFeatures { name; displayName; maxHortas; fullYearWatering; fullYearCalendar; savingsDetail }`, `PLAN_FEATURES`, `PLAN_COPY: PlanCopy[]`, `getPlanFromPriceId`, `getPlanFeatures`
  - `plan-limits.ts`: `getUserPlan(userId): Promise<PlanType>`
  - `garden-view.ts`: `gardenView(input, userId): Promise<{ view: PlanView; month: number }>`, `getUserGarden(rawId: string, userId: string)` (devolve a linha de `gardens` ou `null`)

- [ ] **Step 1: Acrescentar `gardens` a `src/lib/schema.ts`, sem apagar nada ainda.** Assim o `drizzle-kit generate` não pergunta se é uma renomeação.

Junta `import type { GardenInput } from "./garden/types";` aos imports. Depois, a seguir a `subscriptions`:

```ts
export const gardens = pgTable(
	"gardens",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 80 }).notNull(),
		input: json("input").$type<GardenInput>().notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(t) => ({ gardensUserIdx: index("gardens_user_idx").on(t.userId) }),
);
```

Run: `npx drizzle-kit generate --name gardens`
Expected: cria `drizzle/0002_gardens.sql` com `CREATE TABLE "gardens"` e não faz perguntas

- [ ] **Step 2: Apagar `plants`, `products` e `calculations` de `src/lib/schema.ts`.** Retira `decimal` do import se deixar de ser usado. Depois gera a segunda migração:

Run: `npx drizzle-kit generate --name drop_legacy_tables`
Expected: cria `drizzle/0003_drop_legacy_tables.sql` com três `DROP TABLE` e não faz perguntas. Se fizer uma pergunta, pára e reporta.

- [ ] **Step 3: Confirmar que as tabelas estão vazias e aplicar as migrações localmente**

Run: `docker exec growzy-postgres psql -U postgres -d growzy -Atc "select (select count(*) from plants)+(select count(*) from products)+(select count(*) from calculations)"`
Expected: `0`. Se não for 0, **pára e reporta**: não apagues dados.

Run: `npx drizzle-kit migrate`
Expected: aplica as migrações sem erro. Confirma com `docker exec growzy-postgres psql -U postgres -d growzy -c "\d gardens"`

- [ ] **Step 4: Reescrever `src/lib/plans.ts`**

```ts
/**
 * Planos e o que cada um inclui. Só entra aqui o que já existe na app.
 */

export const PLAN_TYPES = {
	FREE: "free",
	STANDARD: "standard",
	PREMIUM: "premium",
} as const;

export type PlanType = (typeof PLAN_TYPES)[keyof typeof PLAN_TYPES];

export interface PlanFeatures {
	name: string;
	displayName: string;
	maxHortas: number; // -1 = ilimitado
	fullYearWatering: boolean;
	fullYearCalendar: boolean;
	savingsDetail: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
	free: { name: "free", displayName: "Grátis", maxHortas: 3, fullYearWatering: false, fullYearCalendar: false, savingsDetail: false },
	standard: { name: "standard", displayName: "Standard", maxHortas: -1, fullYearWatering: true, fullYearCalendar: true, savingsDetail: true },
	premium: { name: "premium", displayName: "Premium", maxHortas: -1, fullYearWatering: true, fullYearCalendar: true, savingsDetail: true },
};

export type PlanCopy = {
	type: PlanType;
	name: string;
	price: string;
	period: string;
	yearly?: string;
	description: string;
	features: string[];
	available: boolean; // false = "Em breve", sem compra
};

// Fonte única para a landing e /pricing.
export const PLAN_COPY: PlanCopy[] = [
	{
		type: "free",
		name: "Grátis",
		price: "0",
		period: "para sempre",
		description: "Para a primeira varanda.",
		features: [
			"Planeia a horta a partir das medidas do teu espaço",
			"Lista de compras e custo, só com o que precisas",
			"Rega e calendário do mês atual",
			"Quanto poupas e quando a horta se paga",
			"Até 3 hortas guardadas",
		],
		available: true,
	},
	{
		type: "standard",
		name: "Standard",
		price: "4,99",
		period: "/mês",
		yearly: "ou €39/ano",
		description: "Para a época inteira.",
		features: [
			"Tudo do Grátis",
			"Hortas ilimitadas",
			"Rega mês a mês, o ano todo",
			"Calendário de 12 meses para a tua zona",
			"Poupança por cultura e a partir da 2.ª época",
		],
		available: true,
	},
	{
		type: "premium",
		name: "Premium",
		price: "9,99",
		period: "/mês",
		yearly: "ou €79/ano",
		description: "Em breve.",
		features: ["Tudo do Standard", "Rega ajustada à meteorologia do IPMA", "Alertas de geada e calor"],
		available: false,
	},
];

/**
 * Mapeia o Stripe Price ID para o tipo de plano
 */
export function getPlanFromPriceId(priceId: string): PlanType {
	if (priceId === process.env.STRIPE_STANDARD_PRICE_ID) {
		return PLAN_TYPES.STANDARD;
	}
	if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
		return PLAN_TYPES.PREMIUM;
	}
	return PLAN_TYPES.FREE;
}

export function getPlanFeatures(planType: PlanType): PlanFeatures {
	return PLAN_FEATURES[planType] || PLAN_FEATURES[PLAN_TYPES.FREE];
}
```

- [ ] **Step 5: Reescrever `src/lib/plan-limits.ts`**

```ts
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import type { PlanType } from "@/lib/plans";
import { users } from "@/lib/schema";

export async function getUserPlan(userId: string): Promise<PlanType> {
	const [user] = await db
		.select({ subscriptionPlan: users.subscriptionPlan })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return (user?.subscriptionPlan as PlanType) || "free";
}
```

- [ ] **Step 6: Criar `src/lib/garden-view.ts`**

```ts
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lisbonMonth, planGarden } from "@/lib/garden/plan";
import { type PlanView, redactForPlan } from "@/lib/garden/redact";
import type { GardenInput } from "@/lib/garden/types";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";

/** Resultado do motor já filtrado pelo plano do utilizador. */
export async function gardenView(input: GardenInput, userId: string): Promise<{ view: PlanView; month: number }> {
	const month = lisbonMonth();
	const features = getPlanFeatures(await getUserPlan(userId));
	return { view: redactForPlan(planGarden(input, month), features, month), month };
}

/** Horta do utilizador, ou null (id inválido ou de outra pessoa). */
export async function getUserGarden(rawId: string, userId: string) {
	const id = Number(rawId);
	if (!Number.isInteger(id) || id <= 0) return null;
	const [row] = await db
		.select()
		.from(gardens)
		.where(and(eq(gardens.id, id), eq(gardens.userId, userId)));
	return row ?? null;
}
```

- [ ] **Step 7: Em `src/app/api/subscription/checkout/route.ts`, aceitar só o Standard.** Substitui o bloco "Validar plano" e o cálculo do `priceId` por:

```ts
	// Premium só se vende quando existir (Fase 3 do PRD)
	if (plan !== PLAN_TYPES.STANDARD) {
		return NextResponse.json({ ok: false, error: "Plano indisponível" }, { status: 400 });
	}

	const priceId = process.env.STRIPE_STANDARD_PRICE_ID;
```

- [ ] **Step 8: Apagar o código antigo**

```bash
git rm -r -q src/app/api/calculator src/app/api/calculations src/app/api/dashboard/summary src/app/api/user/plan-info src/components/plan-display.tsx
grep -rnE "calculations|plants as|products as|plan-display|PlanDisplay|maxPlantsPerHorta|hasAIPlanning|checkPlantLimit" src | grep -v "src/lib/garden" || echo "sem referências"
```

Expected: só podem aparecer referências em `src/app/[locale]/(protected)/dashboard/page.tsx` e em `src/components/calculator/calculator-client.tsx`/`calculator/page.tsx`, que as Tasks 7–8 reescrevem. Também a landing e o `/pricing` (Task 6). Mais nenhuma.

- [ ] **Step 9: Typecheck dos ficheiros desta task**

Run: `npx tsc --noEmit 2>&1 | grep "error TS" | grep -vE "dashboard/page.tsx|calculator|pricing|stripe/webhook|subscription/success|apiVersion"`
Expected: nada. Os erros que ficam são das páginas que as Tasks 6–8 reescrevem e os 3 erros antigos do Stripe.

- [ ] **Step 10: Commit**

```bash
git add -A src/lib drizzle src/app/api/subscription/checkout/route.ts
git commit -m "feat(db): tabela gardens, planos só com o que existe, remove modelo antigo"
```

---

### Task 5: Rotas da API

**Files:**
- Create: `src/app/api/garden/plan/route.ts`, `src/app/api/gardens/route.ts`, `src/app/api/gardens/[id]/route.ts`

**Interfaces:**
- Consumes: `gardenInputSchema`, `gardenBodySchema` (`@/lib/garden/schema`); `gardenView`, `getUserGarden` (`@/lib/garden-view`); `getUserPlan` (`@/lib/plan-limits`); `getPlanFeatures` (`@/lib/plans`); `gardens` (`@/lib/schema`); `getSessionUser` (`@/lib/session`)
- Produces:
  - `POST /api/garden/plan` (body `GardenInput`) → `{ ok: true, data: { view: PlanView, month: number } }`
  - `POST /api/gardens` (body `{ name, input }`) → 201 `{ ok: true, data: <linha de gardens> }`, ou 403 `{ ok: false, code: "PLAN_LIMIT_EXCEEDED", error }`
  - `GET /api/gardens/[id]` → `{ ok: true, data: { garden, view, month } }`
  - `PATCH /api/gardens/[id]` (body parcial `{ name?, input? }`) → `{ ok: true, data: <linha> }`
  - `DELETE /api/gardens/[id]` → `{ ok: true }`

- [ ] **Step 1: Criar `src/app/api/garden/plan/route.ts`**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { gardenView } from "@/lib/garden-view";
import { gardenInputSchema } from "@/lib/garden/schema";
import { getSessionUser } from "@/lib/session";

export async function POST(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const parsed = gardenInputSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
	}

	return NextResponse.json({ ok: true, data: await gardenView(parsed.data, user.id) });
}
```

- [ ] **Step 2: Criar `src/app/api/gardens/route.ts`**

```ts
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { gardenBodySchema } from "@/lib/garden/schema";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

export async function POST(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const parsed = gardenBodySchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
	}

	const features = getPlanFeatures(await getUserPlan(user.id));
	if (features.maxHortas !== -1) {
		// ponytail: contar e inserir não é atómico; dois pedidos simultâneos podem passar o limite por 1. Aceitável aqui.
		const [{ n }] = await db.select({ n: count() }).from(gardens).where(eq(gardens.userId, user.id));
		if (n >= features.maxHortas) {
			return NextResponse.json(
				{
					ok: false,
					code: "PLAN_LIMIT_EXCEEDED",
					error: `O plano ${features.displayName} guarda até ${features.maxHortas} hortas.`,
				},
				{ status: 403 },
			);
		}
	}

	const [row] = await db
		.insert(gardens)
		.values({ userId: user.id, ...parsed.data })
		.returning();
	return NextResponse.json({ ok: true, data: row }, { status: 201 });
}
```

- [ ] **Step 3: Criar `src/app/api/gardens/[id]/route.ts`**

```ts
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { gardenView, getUserGarden } from "@/lib/garden-view";
import { gardenBodySchema } from "@/lib/garden/schema";
import { gardens } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

const unauthorized = () => NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
const notFound = () => NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

export async function GET(request: NextRequest, { params }: Ctx) {
	const user = await getSessionUser(request);
	if (!user) return unauthorized();
	const garden = await getUserGarden((await params).id, user.id);
	if (!garden) return notFound();
	return NextResponse.json({ ok: true, data: { garden, ...(await gardenView(garden.input, user.id)) } });
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
	const user = await getSessionUser(request);
	if (!user) return unauthorized();
	const parsed = gardenBodySchema.partial().safeParse(await request.json().catch(() => null));
	if (!parsed.success || Object.keys(parsed.data).length === 0) {
		return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
	}
	const garden = await getUserGarden((await params).id, user.id);
	if (!garden) return notFound();
	const [row] = await db.update(gardens).set(parsed.data).where(eq(gardens.id, garden.id)).returning();
	return NextResponse.json({ ok: true, data: row });
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
	const user = await getSessionUser(request);
	if (!user) return unauthorized();
	const garden = await getUserGarden((await params).id, user.id);
	if (!garden) return notFound();
	await db.delete(gardens).where(eq(gardens.id, garden.id));
	return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Teste de fumo contra o servidor em `localhost:3000`.** Usa um script no scratchpad, não no repositório:

```bash
B=http://localhost:3000; J=$(mktemp); K=$(mktemp); TS=$(date +%s)
H=(-H 'Content-Type: application/json' -H "Origin: $B")
signup() { curl -s -c "$1" "${H[@]}" -d "{\"name\":\"Teste\",\"email\":\"t$TS$2@growzy.test\",\"password\":\"password1234\"}" $B/api/auth/sign-up/email >/dev/null; }
signup $J a; signup $K b
IN='{"zone":"litoral-norte","space":{"kind":"vasos","widthCm":200,"lengthCm":100},"light":"sol","irrigation":"regador","crops":[{"slug":"tomate"},{"slug":"manjericao"}],"owned":[]}'
echo "plan sem sessão:"; curl -s -o /dev/null -w "%{http_code}\n" "${H[@]}" -d "$IN" $B/api/garden/plan            # 401
echo "plan:"; curl -s -b $J "${H[@]}" -d "$IN" $B/api/garden/plan | node -e 'const r=JSON.parse(require("fs").readFileSync(0));console.log(r.ok, r.data.view.watering.length, r.data.view.locked, r.data.view.shopping.total)'  # true 1 [3 chaves] {81.6,163,...}
echo "plan inválido:"; curl -s -o /dev/null -w "%{http_code}\n" -b $J "${H[@]}" -d '{"zone":"x"}' $B/api/garden/plan  # 400
for i in 1 2 3; do curl -s -o /dev/null -w "create $i: %{http_code}\n" -b $J "${H[@]}" -d "{\"name\":\"H$i\",\"input\":$IN}" $B/api/gardens; done  # 201 x3
curl -s -w " %{http_code}\n" -b $J "${H[@]}" -d "{\"name\":\"H4\",\"input\":$IN}" $B/api/gardens   # 403 PLAN_LIMIT_EXCEEDED
ID=$(docker exec growzy-postgres psql -U postgres -d growzy -Atc "select g.id from gardens g join users u on u.id=g.user_id where u.email='t${TS}a@growzy.test' limit 1")
curl -s -o /dev/null -w "get dono: %{http_code}\n" -b $J $B/api/gardens/$ID                       # 200
curl -s -o /dev/null -w "get outro: %{http_code}\n" -b $K $B/api/gardens/$ID                      # 404
curl -s -o /dev/null -w "patch outro: %{http_code}\n" -b $K -X PATCH "${H[@]}" -d '{"name":"x"}' $B/api/gardens/$ID  # 404
curl -s -o /dev/null -w "delete outro: %{http_code}\n" -b $K -X DELETE -H "Origin: $B" $B/api/gardens/$ID          # 404
curl -s -o /dev/null -w "patch vazio: %{http_code}\n" -b $J -X PATCH "${H[@]}" -d '{}' $B/api/gardens/$ID           # 400
curl -s -w " patch dono: %{http_code}\n" -b $J -X PATCH "${H[@]}" -d '{"name":"Renomeada"}' $B/api/gardens/$ID | tail -c 40
curl -s -o /dev/null -w "delete dono: %{http_code}\n" -b $J -X DELETE -H "Origin: $B" $B/api/gardens/$ID            # 200
curl -s -o /dev/null -w "get abc: %{http_code}\n" -b $J $B/api/gardens/abc                        # 404
docker exec growzy-postgres psql -U postgres -d growzy -c "delete from users where email like 't${TS}%@growzy.test'"
```

Expected: os códigos indicados nos comentários. O `plan` de um utilizador Grátis devolve `watering.length` = 1 e `locked` com 3 chaves. Se o sign-up falhar por causa do origin, vê `BETTER_AUTH_URL` no `.env` e usa esse host.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/garden src/app/api/gardens
git commit -m "feat(api): calcular horta e CRUD de hortas com limite do plano"
```

---

### Task 6: Copy dos planos (landing e /pricing)

**Files:**
- Modify: `src/components/landing/pricing-section.tsx`, `src/app/[locale]/pricing/page.tsx`

**Interfaces:**
- Consumes: `PLAN_COPY`, `PlanCopy` (`@/lib/plans`)

- [ ] **Step 1: `pricing-section.tsx`.** Apaga o array `plans` local e passa a usar `PLAN_COPY`:
  - o destaque é `plan.type === "standard"`;
  - o CTA é "Começar grátis" (free), "Escolher Standard" (standard) ou, quando `!plan.available`, um `<span>` que diz "Em breve", sem link;
  - retira o selo "O mais escolhido", porque não há dados que o provem (MELHORIAS.md).

Substitui o início do ficheiro até antes de `export function` por:

```tsx
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_COPY } from "@/lib/plans";

interface PricingSectionProps {
	locale: string;
}

const CTA: Record<string, string> = { free: "Começar grátis", standard: "Escolher Standard" };
```

No JSX:
- troca `plans.map` por `PLAN_COPY.map`;
- `plan.highlighted` passa a `plan.type === "standard"`;
- apaga o bloco `{plan.highlighted && (<span ...>O mais escolhido</span>)}`;
- substitui o `<Link href={`/${locale}/calculator`} className="mt-10">…</Link>` final por:

```tsx
							{plan.available ? (
								<Link href={`/${locale}/calculator`} className="mt-10">
									<Button variant={plan.type === "standard" ? "tomato" : "outline"} size="lg" className="w-full">
										{CTA[plan.type]}
									</Button>
								</Link>
							) : (
								<span className="mt-10 block rounded-full border border-dashed border-ink/30 py-4 text-center font-semibold text-ink-soft">
									Em breve
								</span>
							)}
```

- [ ] **Step 2: `src/app/[locale]/pricing/page.tsx`.** Reescreve-o para usar `PLAN_COPY`, os tokens da marca e nada que prometa features inexistentes. Retira a secção "Porquê escolher Premium?" e o link para `/contact` (a página não existe):

```tsx
import Link from "next/link";
import { headers } from "next/headers";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/pricing/checkout-button";
import { auth } from "@/lib/auth";
import { PLAN_COPY } from "@/lib/plans";

interface PricingPageProps {
	params: Promise<{ locale: string }>;
}

export default async function PricingPage({ params }: PricingPageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	const isLoggedIn = !!session;

	return (
		<div className="min-h-screen bg-paper">
			<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
				<h1 className="display text-4xl text-ink sm:text-5xl">Começa grátis. Cresce quando quiseres.</h1>
				<p className="mt-4 max-w-2xl text-lg text-ink-soft">
					O Grátis responde ao que precisas hoje. O Standard dá-te a época inteira. Sem fidelização.
				</p>

				<div className="mt-12 grid gap-6 lg:grid-cols-3">
					{PLAN_COPY.map((plan) => {
						const highlighted = plan.type === "standard";
						return (
							<div
								key={plan.type}
								className={
									highlighted
										? "flex flex-col rounded-[2rem] bg-moss p-8 text-paper"
										: "flex flex-col rounded-[2rem] border border-line bg-card p-8 text-ink"
								}
							>
								<h2 className="text-2xl font-bold">{plan.name}</h2>
								<p className={highlighted ? "mt-1 text-paper/75" : "mt-1 text-ink-soft"}>{plan.description}</p>
								<p className="mt-8 flex items-baseline gap-1">
									<span className="font-display text-xl font-bold">€</span>
									<span className="font-display text-6xl font-extrabold tracking-tighter tabular-nums">{plan.price}</span>
									<span className={highlighted ? "text-paper/70" : "text-ink-soft"}>{plan.period}</span>
								</p>
								<p className={`mt-1 h-5 text-sm ${highlighted ? "text-paper/70" : "text-ink-soft"}`}>{plan.yearly}</p>
								<ul className="mt-8 flex-1 space-y-3">
									{plan.features.map((f) => (
										<li key={f} className="flex items-start gap-3">
											<Check className={`mt-0.5 h-5 w-5 shrink-0 ${highlighted ? "text-sprout" : "text-moss"}`} strokeWidth={2.5} />
											<span>{f}</span>
										</li>
									))}
								</ul>
								<div className="mt-8">
									{!plan.available ? (
										<span className="block rounded-full border border-dashed border-current py-3 text-center font-semibold opacity-70">
											Em breve
										</span>
									) : plan.type === "standard" && isLoggedIn ? (
										<CheckoutButton plan="standard" label="Escolher Standard" />
									) : (
										<Link href={isLoggedIn ? `/${locale}/calculator` : `/${locale}/register`}>
											<Button variant={highlighted ? "tomato" : "outline"} size="lg" className="w-full">
												{plan.type === "free" ? "Começar grátis" : "Criar conta e escolher Standard"}
											</Button>
										</Link>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
```

- [ ] **Step 3: Confirmar que não ficou copy antiga**

Run: `grep -rnE "Planeamento com IA|Previsões de colheita|Alertas personalizados|Consultoria|API access|Suporte 24|Suporte prioritário|plantas na base|Calculadora avançada|Exportação de relatórios" src || echo limpo`
Expected: `limpo`. Se aparecer alguma destas frases noutra secção da landing (`features-section.tsx`, `faq-section.tsx`, `hero-section.tsx`, `how-it-works-section.tsx`), reescreve só essa frase para descrever o que o motor faz: medidas → plantas, lista de compras, rega e calendário do mês, poupança.

- [ ] **Step 4: Verificar no browser** `http://localhost:3000/pt/pricing` e `http://localhost:3000/pt#pricing` a 360 px e a 1280 px. As duas listas têm de ser iguais e o Premium tem de mostrar "Em breve" sem botão de compra.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing src/app/[locale]/pricing/page.tsx
git commit -m "feat(copy): planos gerados de PLAN_COPY, Premium em breve"
```

---

### Task 7: Componente de resultado e calculadora

**Files:**
- Create: `src/components/garden/garden-report.tsx`
- Modify (rewrite): `src/components/calculator/calculator-client.tsx`, `src/app/[locale]/(protected)/calculator/page.tsx`

**Interfaces:**
- Consumes: `PlanView` (`@/lib/garden/redact`), `GardenInput`, `ShoppingLine` (`@/lib/garden/types`), `CROPS`, `cropBySlug`, `supplyBySlug` (`@/lib/garden/catalog`), `lightOk` (`@/lib/garden/allocate`), `getUserGarden` (`@/lib/garden-view`), `POST /api/garden/plan`, `POST /api/gardens`, `PATCH /api/gardens/[id]`
- Produces:
  - `GardenReport({ view, month, locale, full?, onToggleOwned? })`
  - `MONTHS: string[]` (nomes em pt-PT, índice 0 = janeiro)
  - `everyLabel(n: number): string` ("todos os dias" | "de N em N dias")
  - `CalculatorClient({ locale, garden? })`, com `garden = { id, name, input }` para editar

- [ ] **Step 1: Criar `src/components/garden/garden-report.tsx`**

```tsx
import { Lock } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cropBySlug, supplyBySlug } from "@/lib/garden/catalog";
import type { PlanView } from "@/lib/garden/redact";
import type { AllocatedCrop, ShoppingLine } from "@/lib/garden/types";
import { cn } from "@/lib/utils";

export const MONTHS = [
	"janeiro",
	"fevereiro",
	"março",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro",
];

export const everyLabel = (n: number) => (n === 1 ? "todos os dias" : `de ${n} em ${n} dias`);

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
const liters = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 });
const money = (min: number, max: number) => `${euro.format(min)} – ${euro.format(max)}`;
const cropName = (slug: string) => cropBySlug.get(slug)?.name ?? slug;
const containerLabel = (c: AllocatedCrop) =>
	c.container === "floreira-80"
		? `${c.perContainer} por floreira de 80 cm`
		: `vaso de ${supplyBySlug.get(c.container ?? "")?.volumeL} L`;

const GROUPS: [ShoppingLine["group"], string][] = [
	["plantas", "Plantas e sementes"],
	["recipientes", "Recipientes e substrato"],
	["ferramentas", "Ferramentas"],
	["rega", "Rega"],
];

const LOCKED: Record<string, string> = {
	"watering.year": "rega mês a mês, o ano inteiro",
	"calendar.year": "calendário de 12 meses",
	"savings.detail": "poupança por cultura e a partir da 2.ª época",
};

function Box({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="rounded-lg border border-line bg-card p-4">
			<h3 className="mb-2 font-display text-lg font-bold text-ink">{title}</h3>
			{children}
		</section>
	);
}

function MonthTasks({ m }: { m: PlanView["calendar"]["months"][number] }) {
	const rows: [string, string[]][] = [
		["Semear", m.sow],
		["Transplantar", m.transplant],
		["Colher", m.harvest],
	];
	const filled = rows.filter(([, slugs]) => slugs.length);
	if (!filled.length) return <p className="text-sm text-ink-soft">Nada a semear, transplantar ou colher.</p>;
	return (
		<ul className="space-y-1 text-sm">
			{filled.map(([label, slugs]) => (
				<li key={label}>
					<strong>{label}:</strong> {slugs.map(cropName).join(", ")}
				</li>
			))}
		</ul>
	);
}

type Props = {
	view: PlanView;
	month: number;
	locale: string;
	full?: boolean;
	onToggleOwned?: (slug: string, owned: boolean) => void;
};

export function GardenReport({ view, month, locale, full = false, onToggleOwned }: Props) {
	const { allocation, shopping, savings, calendar } = view;
	const quantity = new Map(allocation.crops.map((c) => [c.slug, c.quantity]));
	const now = calendar.months.find((m) => m.month === month);
	const waterMonths = full ? view.watering : view.watering.filter((w) => w.month === month);
	const [year, mm] = (shopping.lines[0]?.checkedAt ?? "").split("-");

	return (
		<div className="space-y-4">
			<Box title="Espaço">
				<div
					className="h-2 overflow-hidden rounded-full bg-paper-2"
					role="meter"
					aria-label="Espaço ocupado"
					aria-valuenow={allocation.usedPct}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<div
						className={allocation.usedPct > 100 ? "h-full bg-tomato" : "h-full bg-moss"}
						style={{ width: `${Math.min(100, allocation.usedPct)}%` }}
					/>
				</div>
				<p className="mt-2 text-sm text-ink-soft">{allocation.usedPct}% do espaço ocupado</p>
				{allocation.warnings.map((w) => (
					<p key={w} className="mt-1 text-sm font-semibold text-tomato-deep">
						{w}
					</p>
				))}
				<ul className="mt-3 space-y-1 text-sm">
					{allocation.crops.map((c) => (
						<li key={c.slug}>
							{cropName(c.slug)}: <strong className="tabular-nums">{c.quantity}</strong>
							{c.container ? ` · ${containerLabel(c)}` : ""}
						</li>
					))}
				</ul>
				{allocation.excluded.map((e) => (
					<p key={e.slug} className="mt-1 text-sm text-ink-soft">
						<span className="line-through">{cropName(e.slug)}</span>: {e.reason}
					</p>
				))}
			</Box>

			<Box title="Custo">
				<p className="display text-4xl tabular-nums text-ink">{euro.format(shopping.total.mid)}</p>
				<p className="text-sm text-ink-soft">
					entre {money(shopping.total.min, shopping.total.max)} · estimativa
					{mm ? `, preços de ${MONTHS[Number(mm) - 1].slice(0, 3)}/${year}` : ""}
				</p>
			</Box>

			<Box title="Compensa?">
				<p className="font-semibold text-ink">
					{savings.paybackWeeks !== null
						? `Paga-se em cerca de ${savings.paybackWeeks} semanas`
						: savings.verdict === "paga-se na 2.ª época"
							? "Não se paga na 1.ª época, mas paga-se na 2.ª"
							: "Não compensa financeiramente. Mas sabe melhor."}
				</p>
				<p className="mt-1 text-sm text-ink-soft">
					Colheita estimada: {money(savings.harvestValue.min, savings.harvestValue.max)} a preços de supermercado.
				</p>
				<p className="text-sm text-ink-soft">Saldo da 1.ª época: {money(savings.firstSeason.min, savings.firstSeason.max)}</p>
				{savings.nextSeason && (
					<p className="text-sm text-ink-soft">
						Saldo a partir da 2.ª: {money(savings.nextSeason.min, savings.nextSeason.max)} por época
					</p>
				)}
				{full && savings.byCrop && (
					<ul className="mt-2 space-y-1 text-sm">
						{savings.byCrop.map((c) => (
							<li key={c.slug}>
								{cropName(c.slug)}: {money(c.min, c.max)}
							</li>
						))}
					</ul>
				)}
			</Box>

			<Box title={waterMonths.length > 1 ? "Rega, mês a mês" : `Rega em ${MONTHS[month - 1]}`}>
				{waterMonths.map((w) => (
					<div key={w.month} className="border-t border-line py-2 first:border-t-0 first:pt-0">
						{waterMonths.length > 1 && <h4 className="text-sm font-semibold capitalize">{MONTHS[w.month - 1]}</h4>}
						{w.crops.length === 0 ? (
							<p className="text-sm text-ink-soft">Nada na horta este mês.</p>
						) : (
							<>
								<ul className="space-y-1 text-sm">
									{w.crops.map((c) => (
										<li key={c.slug}>
											{cropName(c.slug)} ({quantity.get(c.slug)}):{" "}
											{c.everyDays === null
												? "a chuva chega"
												: `${liters.format(c.litersPerWatering)} L cada, ${everyLabel(c.everyDays)}`}
										</li>
									))}
								</ul>
								{w.timer && (
									<p className="mt-1 text-sm">
										Temporizador: {w.timer.minutes} min, {everyLabel(w.timer.everyDays)}, às 7h00.
									</p>
								)}
								<p className="mt-1 text-xs text-ink-soft">
									{w.hint} Cerca de {liters.format(w.litersPerWeek)} L por semana.
								</p>
							</>
						)}
					</div>
				))}
			</Box>

			<Box title={`Em ${MONTHS[month - 1]}`}>
				{now && <MonthTasks m={now} />}
				<ul className="mt-2 space-y-1 text-sm text-ink-soft">
					{calendar.crops.map(
						(c) =>
							c.next && (
								<li key={c.slug}>
									{cropName(c.slug)}: {c.next.action === "semear" ? "semeia" : "transplanta"}{" "}
									{c.next.month === month ? "já" : `em ${MONTHS[c.next.month - 1]}`}
								</li>
							),
					)}
				</ul>
				<p className="mt-2 text-xs text-ink-soft">Datas aproximadas para a tua zona.</p>
			</Box>

			{full && calendar.months.length > 1 && (
				<Box title="Calendário do ano">
					<ul className="divide-y divide-line">
						{calendar.months.map((m) => (
							<li key={m.month} className="py-2">
								<h4 className="text-sm font-semibold capitalize">{MONTHS[m.month - 1]}</h4>
								<MonthTasks m={m} />
							</li>
						))}
					</ul>
				</Box>
			)}

			{full && (
				<Box title="Lista de compras">
					{GROUPS.map(([group, label]) => {
						const lines = shopping.lines.filter((l) => l.group === group);
						if (!lines.length) return null;
						return (
							<div key={group} className="mt-3 first:mt-0">
								<h4 className="text-sm font-semibold">{label}</h4>
								<ul className="divide-y divide-line">
									{lines.map((l) => (
										<li key={l.slug} className="flex items-center gap-3 py-2 text-sm">
											{onToggleOwned && l.group !== "plantas" && (
												<input
													type="checkbox"
													className="h-5 w-5 accent-moss"
													checked={l.owned}
													onChange={(e) => onToggleOwned(l.slug, e.target.checked)}
													aria-label={`Já tenho: ${l.name}`}
												/>
											)}
											<span className={cn("flex-1", l.owned && "text-ink-soft line-through")}>
												{l.quantity} {l.unit} · {l.name}
											</span>
											<span className="tabular-nums">{money(l.min, l.max)}</span>
										</li>
									))}
								</ul>
							</div>
						);
					})}
					{onToggleOwned && <p className="mt-2 text-xs text-ink-soft">Marca o que já tens: sai do total.</p>}
				</Box>
			)}

			{view.locked.length > 0 && (
				<Link
					href={`/${locale}/pricing`}
					className="flex items-start gap-3 rounded-lg border border-dashed border-moss/40 p-4 text-sm text-ink hover:bg-paper-2"
				>
					<Lock className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
					<span>
						<strong>No Standard:</strong> {view.locked.map((k) => LOCKED[k]).join(", ")}.
					</span>
				</Link>
			)}
		</div>
	);
}
```

- [ ] **Step 2: Reescrever `src/components/calculator/calculator-client.tsx`**

```tsx
"use client";

import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GardenReport } from "@/components/garden/garden-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lightOk } from "@/lib/garden/allocate";
import { CROPS, cropBySlug } from "@/lib/garden/catalog";
import type { PlanView } from "@/lib/garden/redact";
import type { GardenInput } from "@/lib/garden/types";
import { cn } from "@/lib/utils";

const DEFAULT_INPUT: GardenInput = {
	zone: "litoral-norte",
	space: { kind: "vasos", widthCm: 200, lengthCm: 100 },
	light: "sol",
	irrigation: "regador",
	crops: [],
	owned: [],
};

const norm = (s: string) =>
	s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();
const validSize = (n: number) => Number.isInteger(n) && n >= 30 && n <= 2000;

function Choice<T extends string>({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: T;
	options: [T, string][];
	onChange: (v: T) => void;
}) {
	return (
		<fieldset className="space-y-2">
			<legend className="text-sm font-semibold text-ink">{label}</legend>
			<div className="flex flex-wrap gap-2">
				{options.map(([v, text]) => (
					<button
						key={v}
						type="button"
						aria-pressed={value === v}
						onClick={() => onChange(v)}
						className={cn(
							"min-h-11 rounded-full border px-4 text-sm transition-colors duration-200",
							value === v ? "border-moss bg-moss text-paper" : "border-line bg-card text-ink hover:border-moss",
						)}
					>
						{text}
					</button>
				))}
			</div>
		</fieldset>
	);
}

type Props = { locale: string; garden?: { id: number; name: string; input: GardenInput } };

export function CalculatorClient({ locale, garden }: Props) {
	const router = useRouter();
	const [input, setInput] = useState<GardenInput>(garden?.input ?? DEFAULT_INPUT);
	const [query, setQuery] = useState("");
	const [result, setResult] = useState<{ view: PlanView; month: number } | null>(null);
	const [error, setError] = useState<{ text: string; upgrade?: boolean } | null>(null);
	const [name, setName] = useState(garden?.name ?? "");
	const [saving, setSaving] = useState(false);

	const set = (patch: Partial<GardenInput>) => setInput((i) => ({ ...i, ...patch }));
	const setSpace = (patch: Partial<GardenInput["space"]>) => setInput((i) => ({ ...i, space: { ...i.space, ...patch } }));
	const setCrop = (slug: string, patch: Partial<GardenInput["crops"][number]>) =>
		setInput((i) => ({ ...i, crops: i.crops.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) }));

	const sizesOk = validSize(input.space.widthCm) && validSize(input.space.lengthCm);
	const ready = input.crops.length > 0 && sizesOk;

	useEffect(() => {
		if (!ready) return;
		const controller = new AbortController();
		const timer = setTimeout(async () => {
			try {
				const res = await fetch("/api/garden/plan", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(input),
					signal: controller.signal,
				});
				const json = await res.json();
				if (!json.ok) throw new Error(json.error);
				setResult(json.data);
				setError(null);
			} catch {
				if (!controller.signal.aborted) setError({ text: "Não consegui recalcular. Mostro o último resultado." });
			}
		}, 300);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [input, ready]);

	const matches = useMemo(() => {
		const chosen = new Set(input.crops.map((c) => c.slug));
		return CROPS.filter((c) => !chosen.has(c.slug) && norm(c.name).includes(norm(query)));
	}, [query, input.crops]);

	const autoQty = (slug: string) => result?.view.allocation.crops.find((a) => a.slug === slug)?.quantity ?? 1;

	const save = async () => {
		setSaving(true);
		const res = await fetch(garden ? `/api/gardens/${garden.id}` : "/api/gardens", {
			method: garden ? "PATCH" : "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: name.trim(), input }),
		});
		const json = await res.json().catch(() => ({ ok: false }));
		setSaving(false);
		if (!json.ok) {
			setError({ text: json.error ?? "Não consegui guardar.", upgrade: json.code === "PLAN_LIMIT_EXCEEDED" });
			return;
		}
		router.push(`/${locale}/calculator/result/${json.data.id}`);
	};

	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="display text-4xl text-ink">{garden ? `Editar ${garden.name}` : "Planeia a tua horta"}</h1>
			<p className="mt-2 text-ink-soft">Diz-nos o espaço e o que queres plantar. Nós fazemos as contas.</p>

			<div className="mt-8 grid gap-8 lg:grid-cols-[1fr_26rem]">
				<div className="space-y-6">
					<section className="space-y-5 rounded-lg border border-line bg-card p-5">
						<h2 className="font-display text-xl font-bold text-ink">1. O teu espaço</h2>
						<Choice
							label="Onde vais plantar"
							value={input.space.kind}
							options={[
								["vasos", "Vasos e floreiras"],
								["canteiro-elevado", "Canteiro elevado"],
								["terra", "Terra"],
							]}
							onChange={(kind) => setSpace({ kind })}
						/>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label htmlFor="width">Largura (cm)</Label>
								<Input
									id="width"
									type="number"
									inputMode="numeric"
									min={30}
									max={2000}
									value={input.space.widthCm || ""}
									onChange={(e) => setSpace({ widthCm: Number(e.target.value) })}
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="length">Comprimento (cm)</Label>
								<Input
									id="length"
									type="number"
									inputMode="numeric"
									min={30}
									max={2000}
									value={input.space.lengthCm || ""}
									onChange={(e) => setSpace({ lengthCm: Number(e.target.value) })}
								/>
							</div>
						</div>
						{!sizesOk && <p className="text-sm text-destructive">As medidas vão de 30 a 2000 cm, em números inteiros.</p>}
						<Choice
							label="Sol direto por dia"
							value={input.light}
							options={[
								["sol", "6 h ou mais"],
								["meia-sombra", "3 a 6 h"],
								["sombra", "menos de 3 h"],
							]}
							onChange={(light) => set({ light })}
						/>
						<Choice
							label="Zona"
							value={input.zone}
							options={[
								["litoral-norte", "Norte e litoral centro"],
								["interior", "Interior"],
								["sul", "Sul e ilhas"],
							]}
							onChange={(zone) => set({ zone })}
						/>
						<Choice
							label="Como vais regar"
							value={input.irrigation}
							options={[
								["regador", "Regador"],
								["gota-a-gota", "Gota-a-gota"],
							]}
							onChange={(irrigation) => set({ irrigation })}
						/>
					</section>

					<section className="space-y-4 rounded-lg border border-line bg-card p-5">
						<h2 className="font-display text-xl font-bold text-ink">2. O que queres plantar</h2>
						{input.crops.length > 0 && (
							<ul className="space-y-2">
								{input.crops.map((c) => {
									const crop = cropBySlug.get(c.slug);
									const q = c.quantity ?? autoQty(c.slug);
									return (
										<li key={c.slug} className="flex flex-wrap items-center gap-2 rounded-md border border-line p-2 pl-3">
											<span className="flex-1 font-medium text-ink">{crop?.name ?? c.slug}</span>
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Menos ${crop?.name}`}
												onClick={() => setCrop(c.slug, { quantity: q > 1 ? q - 1 : undefined })}
											>
												<Minus className="h-4 w-4" />
											</Button>
											<span className="w-10 text-center tabular-nums" aria-live="polite">
												{q}
											</span>
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Mais ${crop?.name}`}
												onClick={() => setCrop(c.slug, { quantity: Math.min(200, q + 1) })}
											>
												<Plus className="h-4 w-4" />
											</Button>
											{c.quantity ? (
												<button
													type="button"
													className="text-xs text-moss underline"
													onClick={() => setCrop(c.slug, { quantity: undefined })}
												>
													auto
												</button>
											) : (
												<span className="text-xs text-ink-soft">auto</span>
											)}
											{crop?.price.planta && (
												<button
													type="button"
													className="rounded-full border border-line px-3 py-1 text-xs"
													aria-label={`Comprar ${crop.name} como ${c.from === "semente" ? "planta" : "semente"}`}
													onClick={() => setCrop(c.slug, { from: c.from === "semente" ? "planta" : "semente" })}
												>
													{c.from === "semente" ? "semente" : "planta"}
												</button>
											)}
											<Button
												variant="ghost"
												size="icon"
												aria-label={`Tirar ${crop?.name}`}
												onClick={() => set({ crops: input.crops.filter((x) => x.slug !== c.slug) })}
											>
												<X className="h-4 w-4" />
											</Button>
										</li>
									);
								})}
							</ul>
						)}
						<Input
							placeholder="Procura: tomate, alface, manjericão…"
							aria-label="Procurar cultura"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<ul className="flex flex-wrap gap-2">
							{matches.map((c) => {
								const ok = lightOk(c, input.light);
								return (
									<li key={c.slug}>
										<button
											type="button"
											disabled={!ok || input.crops.length >= 15}
											onClick={() => {
												set({ crops: [...input.crops, { slug: c.slug }] });
												setQuery("");
											}}
											className={cn(
												"min-h-11 rounded-full border border-line px-3 text-sm",
												ok ? "text-ink hover:border-moss" : "cursor-not-allowed text-ink-soft line-through",
											)}
										>
											{c.name}
											{!ok && <span className="sr-only"> (precisa de mais sol)</span>}
										</button>
									</li>
								);
							})}
						</ul>
						{input.light !== "sol" && (
							<p className="text-xs text-ink-soft">As culturas riscadas precisam de mais sol do que tens.</p>
						)}
					</section>
				</div>

				<aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
					{!ready && (
						<p className="rounded-lg border border-dashed border-line p-5 text-ink-soft">
							Escolhe pelo menos uma cultura para ver as contas.
						</p>
					)}
					{error && (
						<p role="alert" className="text-sm text-destructive">
							{error.text}{" "}
							{error.upgrade && (
								<Link href={`/${locale}/pricing`} className="underline">
									Ver planos
								</Link>
							)}
						</p>
					)}
					{ready && result && (
						<>
							<GardenReport view={result.view} month={result.month} locale={locale} />
							<div className="space-y-2 rounded-lg border border-line bg-card p-4">
								<Label htmlFor="garden-name">Nome da horta</Label>
								<Input
									id="garden-name"
									maxLength={80}
									placeholder="Varanda da cozinha"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<Button className="w-full" disabled={saving || !name.trim()} onClick={save}>
									{garden ? "Guardar alterações" : "Guardar horta"}
								</Button>
							</div>
						</>
					)}
				</aside>
			</div>
		</div>
	);
}
```

- [ ] **Step 3: Reescrever `src/app/[locale]/(protected)/calculator/page.tsx`**

```tsx
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CalculatorClient } from "@/components/calculator/calculator-client";
import { auth } from "@/lib/auth";
import { getUserGarden } from "@/lib/garden-view";

interface CalculatorPageProps {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ garden?: string }>;
}

export default async function CalculatorPage({ params, searchParams }: CalculatorPageProps) {
	const { locale } = await params;
	const { garden: gardenId } = await searchParams;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	const garden = gardenId ? await getUserGarden(gardenId, session.user.id) : null;
	if (gardenId && !garden) notFound();

	return (
		<CalculatorClient
			locale={locale}
			garden={garden ? { id: garden.id, name: garden.name, input: garden.input } : undefined}
		/>
	);
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep "error TS" | grep -vE "dashboard/page.tsx|calculator/result|stripe/webhook|subscription/success|apiVersion"`
Expected: nada

- [ ] **Step 5: Verificar no browser** (Playwright MCP ou manualmente) com um utilizador de teste criado como no smoke da Task 5, mas no browser, em `/pt/register`:
  - Em `/pt/calculator`, a 360 px: escolhe "Vasos", 200 × 100, sol, e junta Tomate e Manjericão. Em menos de 1 s aparecem o espaço (59%), o custo de cerca de €122, "Compensa?", a rega do mês atual e "Em <mês>".
  - Apaga a largura (campo vazio): aparece a mensagem dos limites e **não** sai nenhum pedido para `/api/garden/plan` (confirma no separador Network).
  - Muda a luz para "menos de 3 h": o Tomate aparece riscado na lista com o motivo.
  - Guarda com o nome "Teste": redireciona para `/pt/calculator/result/<id>` (a página fica vazia até à Task 8, e não faz mal).
  - Na resposta de `/api/garden/plan` (Network), `watering` tem 1 mês e `locked` tem 3 chaves.
  - Apaga o utilizador de teste no fim (o `delete from users` da Task 5).

- [ ] **Step 6: Commit**

```bash
git add src/components/garden src/components/calculator src/app/[locale]/(protected)/calculator/page.tsx
git commit -m "feat(ui): calculadora espaço → horta com resultado ao vivo"
```

---

### Task 8: Talão da horta e dashboard

**Files:**
- Create: `src/components/garden/garden-result-client.tsx`
- Modify (rewrite): `src/app/[locale]/(protected)/calculator/result/[id]/page.tsx`, `src/app/[locale]/(protected)/dashboard/page.tsx` (substitui o WIP não commitado)

**Interfaces:**
- Consumes: `GardenReport`, `MONTHS`, `everyLabel` (garden-report.tsx); `gardenView`, `getUserGarden` (`@/lib/garden-view`); `planGarden`, `lisbonMonth` (`@/lib/garden/plan`); `cropBySlug`; `getUserPlan`; `getPlanFeatures`; `gardens`; `PATCH/DELETE /api/gardens/[id]`

- [ ] **Step 1: Criar `src/components/garden/garden-result-client.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GardenReport } from "@/components/garden/garden-report";
import { Button } from "@/components/ui/button";
import type { PlanView } from "@/lib/garden/redact";
import type { GardenInput } from "@/lib/garden/types";

type Props = {
	locale: string;
	garden: { id: number; name: string; input: GardenInput };
	view: PlanView;
	month: number;
};

export function GardenResultClient({ locale, garden, view, month }: Props) {
	const router = useRouter();
	// Estado local para que dois cliques seguidos não se anulem.
	const [owned, setOwned] = useState(garden.input.owned);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const send = async (method: "PATCH" | "DELETE", body?: object) => {
		setBusy(true);
		setError(null);
		const res = await fetch(`/api/gardens/${garden.id}`, {
			method,
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : undefined,
		});
		const json = await res.json().catch(() => ({ ok: false }));
		setBusy(false);
		if (!json.ok) setError("Não consegui guardar. Tenta outra vez.");
		return Boolean(json.ok);
	};

	const toggleOwned = async (slug: string, has: boolean) => {
		const next = has ? [...owned.filter((s) => s !== slug), slug] : owned.filter((s) => s !== slug);
		setOwned(next);
		if (await send("PATCH", { input: { ...garden.input, owned: next } })) router.refresh();
	};

	const remove = async () => {
		if (!confirm(`Apagar "${garden.name}"?`)) return;
		if (await send("DELETE")) router.push(`/${locale}/dashboard`);
	};

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm text-ink-soft">A tua horta</p>
					<h1 className="display text-4xl text-ink">{garden.name}</h1>
				</div>
				<div className="flex gap-2">
					<Link href={`/${locale}/calculator?garden=${garden.id}`}>
						<Button variant="outline" size="sm">
							Editar
						</Button>
					</Link>
					<Button variant="ghost" size="sm" onClick={remove} disabled={busy}>
						Apagar
					</Button>
				</div>
			</div>
			{error && (
				<p role="alert" className="mt-4 text-sm text-destructive">
					{error}
				</p>
			)}
			<div className="mt-6">
				<GardenReport view={view} month={month} locale={locale} full onToggleOwned={toggleOwned} />
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Reescrever `src/app/[locale]/(protected)/calculator/result/[id]/page.tsx`**

```tsx
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { GardenResultClient } from "@/components/garden/garden-result-client";
import { auth } from "@/lib/auth";
import { gardenView, getUserGarden } from "@/lib/garden-view";

interface GardenResultPageProps {
	params: Promise<{ locale: string; id: string }>;
}

export default async function GardenResultPage({ params }: GardenResultPageProps) {
	const { locale, id } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	const garden = await getUserGarden(id, session.user.id);
	if (!garden) notFound();

	const { view, month } = await gardenView(garden.input, session.user.id);
	return (
		<GardenResultClient
			locale={locale}
			garden={{ id: garden.id, name: garden.name, input: garden.input }}
			view={view}
			month={month}
		/>
	);
}
```

- [ ] **Step 3: Reescrever `src/app/[locale]/(protected)/dashboard/page.tsx`**

```tsx
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MONTHS, everyLabel } from "@/components/garden/garden-report";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cropBySlug } from "@/lib/garden/catalog";
import { lisbonMonth, planGarden } from "@/lib/garden/plan";
import { getUserPlan } from "@/lib/plan-limits";
import { getPlanFeatures } from "@/lib/plans";
import { gardens } from "@/lib/schema";

interface DashboardPageProps {
	params: Promise<{ locale: string }>;
}

const names = (slugs: string[]) => slugs.map((s) => cropBySlug.get(s)?.name ?? s).join(", ");

export default async function DashboardPage({ params }: DashboardPageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect(`/${locale}/login`);
	}

	const [rows, plan] = await Promise.all([
		db.select().from(gardens).where(eq(gardens.userId, session.user.id)).orderBy(desc(gardens.updatedAt)),
		getUserPlan(session.user.id),
	]);
	const { maxHortas } = getPlanFeatures(plan);
	const month = lisbonMonth();
	const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

	// Só o mês atual: é o que todos os planos veem.
	const items = rows.map((g) => {
		const r = planGarden(g.input, month);
		const days = r.watering[month - 1].crops.flatMap((c) => (c.everyDays === null ? [] : [c.everyDays]));
		const todo = r.calendar.months[month - 1];
		const parts = [
			days.length ? `rega ${everyLabel(Math.min(...days))}` : "sem rega",
			todo.sow.length ? `semeia ${names(todo.sow)}` : "",
			todo.transplant.length ? `transplanta ${names(todo.transplant)}` : "",
			todo.harvest.length ? `colhe ${names(todo.harvest)}` : "",
		].filter(Boolean);
		return { id: g.id, name: g.name, total: euro.format(r.shopping.total.mid), summary: parts.join(" · ") };
	});

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="display text-4xl text-ink">As tuas hortas</h1>
					<p className="mt-1 text-ink-soft">
						{maxHortas === -1 ? `${rows.length} guardadas` : `${rows.length} de ${maxHortas} guardadas`} ·{" "}
						{MONTHS[month - 1]}
					</p>
				</div>
				<Link href={`/${locale}/calculator`}>
					<Button>Nova horta</Button>
				</Link>
			</div>

			{items.length === 0 ? (
				<div className="mt-10 rounded-lg border border-dashed border-line p-8 text-center">
					<p className="font-display text-xl font-bold text-ink">Ainda não tens hortas.</p>
					<p className="mt-1 text-ink-soft">Mede o espaço, escolhe o que queres plantar e nós fazemos as contas.</p>
					<Link href={`/${locale}/calculator`} className="mt-4 inline-block">
						<Button variant="tomato">Planeia a tua primeira horta</Button>
					</Link>
				</div>
			) : (
				<ul className="mt-8 divide-y divide-line rounded-lg border border-line bg-card">
					{items.map((g) => (
						<li key={g.id}>
							<Link
								href={`/${locale}/calculator/result/${g.id}`}
								className="flex flex-wrap items-baseline justify-between gap-2 p-4 hover:bg-paper-2"
							>
								<span>
									<span className="font-semibold text-ink">{g.name}</span>
									<span className="block text-sm text-ink-soft">Este mês: {g.summary}</span>
								</span>
								<span className="tabular-nums text-ink">{g.total}</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
```

- [ ] **Step 4: Typecheck e testes**

Run: `npx tsc --noEmit 2>&1 | grep "error TS" | grep -vE "stripe/webhook|subscription/success|apiVersion"; npm test`
Expected: nenhum erro de tsc fora dos 3 erros antigos do Stripe; os testes passam todos

- [ ] **Step 5: Verificar no browser** (360 px e 1280 px) com um utilizador de teste:
  - Dashboard vazio: aparece o CTA "Planeia a tua primeira horta".
  - Cria uma horta na calculadora e guarda. O talão mostra a lista de compras por grupos, a rega do mês, "Em <mês>" e a caixa "No Standard: …".
  - Marca "Já tenho: Regador": o total desce entre 5 e 12 €, e depois de recarregar a página continua marcado. Marca duas caixas seguidas, depressa: depois de recarregar, as duas ficam marcadas.
  - "Editar" abre a calculadora preenchida. Muda uma quantidade, guarda, e o talão reflete a alteração.
  - O dashboard mostra a horta com "Este mês: rega …" e o total.
  - "Apagar" pede confirmação e volta ao dashboard.
  - Com `update users set subscription_plan='standard' where email=...`: o talão mostra a rega de 12 meses, o calendário do ano e a poupança por cultura, sem caixa de bloqueio.
  - Apaga o utilizador de teste no fim.

- [ ] **Step 6: Commit**

```bash
git add src/components/garden "src/app/[locale]/(protected)/calculator/result" "src/app/[locale]/(protected)/dashboard/page.tsx"
git commit -m "feat(ui): talão da horta e dashboard com o que fazer este mês"
```

---

## Critérios de aceitação (da spec), por task

| Critério | Task |
| --- | --- |
| `npm test` passa, `tsc` sem erros novos | 3, 8 |
| 360 px, 2×1 m com 3 culturas, resultado em menos de 1 s | 7 |
| Grátis não recebe a rega de outros meses | 3 (teste), 5 (smoke), 7 (Network) |
| Grátis com 3 hortas recebe 403 | 5 |
| Landing, `/pricing` e planos iguais, sem promessas falsas | 6 |
| Horta de outra pessoa dá 404 | 5 |
