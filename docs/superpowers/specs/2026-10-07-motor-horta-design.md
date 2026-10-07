# Spec — Motor espaço → horta (distribuição, custo, rega, calendário, poupança)

7 out 2026 · Flávio Vicente · Estado: aprovado em conversa, à espera de revisão escrita

## Objetivo

A pessoa indica o espaço que tem (medidas, tipo, luz, zona) e as culturas que quer. A Growzy responde com quantas plantas cabem, o que comprar e quanto custa, quanto e quando regar, quando semear e colher, e se a horta compensa. É a ideia original do produto e a base de tudo o que vem depois (lembretes, IPMA, IA).

**Critério de sucesso:** num telemóvel, em menos de 1 minuto, alguém com uma varanda de 2 × 1 m sai com uma lista de compras, um total em intervalo, um plano de rega para este mês e o número de semanas até a horta se pagar. Todos os números saem de regras escritas nesta spec e são reproduzíveis nos testes.

**Fora de âmbito:** meteorologia em tempo real (IPMA), lembretes, tarefas, IA, exportação PDF, painel de administração de preços, templates (passam a ser inputs pré-preenchidos, mais tarde).

## Decisões

| Decisão | Escolha | Porquê |
| --- | --- | --- |
| Onde corre o motor | Só no servidor, `POST /api/garden/plan`, cliente com debounce de 300 ms | O resultado calculado e personalizado que é pago nunca chega ao browser de quem não paga. O catálogo (dados de referência públicos) vai no bundle do cliente para o seletor de culturas |
| Onde vivem os dados agronómicos | `src/lib/garden/catalog.ts`, versionado em git | Revisto em PR, testável sem BD, sem migrações para mudar um valor |
| O que se guarda | Só o input (`gardens.input`); o resultado recalcula-se ao abrir | Preços e regras atualizados chegam às hortas antigas |
| Fluxo | O utilizador escolhe culturas; o motor distribui a área; as quantidades podem ser ajustadas | Ajuda a decidir sem tirar controlo |
| `calculations` e rotas antigas | Removidas; a tabela está vazia | Evita dois modelos de horta |
| Testes | `node --test` com TypeScript nativo do Node 25, imports relativos em `src/lib/garden` | Sem dependências novas |

## Módulos

```
src/lib/garden/
  types.ts        GardenInput, GardenResult e tipos do catálogo
  catalog.ts      CROPS, SUPPLIES, CLIMATE (dados, com fontes em comentário)
  allocate.ts     filtro de luz + distribuição de área
  shopping.ts     recipientes, substrato, ferramentas, rega, total em intervalo
  watering.ts     Hargreaves, necessidade por planta, intervalo, gota-a-gota
  calendar.ts     janelas por zona, colheita, vista mensal
  savings.ts      valor da colheita, poupança 1.ª/2.ª época, payback
  plan.ts         planGarden(input, month) → GardenResult (compõe os anteriores)
  redact.ts       redactForPlan(result, plan, month) → resultado sem o que é pago
  schema.ts       validação zod do GardenInput
  *.test.ts       testes node:test
```

Os módulos em `src/lib/garden` só importam entre si com caminhos relativos (sem `@/`), para correrem com `node --test`.

## Input

```ts
type Zone = "litoral-norte" | "interior" | "sul";
type Light = "sol" | "meia-sombra" | "sombra";   // ≥6 h, 3–6 h, <3 h de sol direto

type GardenInput = {
  zone: Zone;
  space: { kind: "vasos" | "canteiro-elevado" | "terra"; widthCm: number; lengthCm: number };
  light: Light;
  irrigation: "regador" | "gota-a-gota";
  crops: { slug: string; quantity?: number; from?: "planta" | "semente" }[];
  owned: string[];   // slugs de SUPPLIES que a pessoa já tem
};
```

Validação (zod, no servidor): `widthCm` e `lengthCm` inteiros de 30 a 2000; `crops` com 1 a 15 entradas, slugs únicos e existentes em `CROPS`; `quantity` inteiro de 1 a 200; `from` por defeito `"planta"`; `owned` só com slugs de `SUPPLIES`. Input inválido → 400 com a lista de erros.

## Catálogo

**Cultura** (cerca de 30: tomate, tomate-cereja, pimento, malagueta, beringela, curgete, pepino, abóbora, feijão-verde, ervilha, fava, alface, rúcula, espinafre, acelga, couve, couve-galega, rabanete, cenoura, beterraba, cebola, alho, alho-francês, morango, manjericão, salsa, coentros, hortelã, cebolinho, alecrim, tomilho):

```ts
type Crop = {
  slug: string; name: string;
  light: Light;                      // luz mínima
  season: "quente" | "fresca";
  spacingCm: number;                 // distância entre plantas
  minPotL: number;                   // volume mínimo de vaso
  kc: number;                        // FAO-56, fase intermédia
  sowMonths: number[];               // 1–12, zona litoral-norte
  transplantMonths: number[];        // [] = sementeira direta
  daysToHarvest: [number, number];
  maxUseful: number;                 // teto por casa na distribuição automática
  yieldKg: [number, number];         // por planta, por época
  marketEurKg: number;               // preço de supermercado
  price: { planta: PriceRange | null; semente: PriceRange };  // semente = pacote
  seedsPerPacket: number;
};
type PriceRange = { min: number; max: number; store: string; checkedAt: string }; // "2026-10"
```

**Material** (`SUPPLIES`): `vaso-3l`, `vaso-10l`, `vaso-20l`, `vaso-40l` (com diâmetro em cm), `floreira-80` (80 × 20 cm, 18 L), `substrato-50l`, `composto-50l`, `regador`, `pa-mao`, `luvas`, `kit-gota-base`, `gotejador`. Cada item tem `group` (`plantas` | `recipientes` | `ferramentas` | `rega`) e `PriceRange`.

**Clima** (`CLIMATE[zone]`): latitude e 12 meses de `tMin`, `tMax` (°C) e `precipMm`. Uma estação representativa por zona: Porto (litoral-norte), Castelo Branco (interior), Faro (sul). Fonte: normais climatológicas do IPMA, citadas no ficheiro.

**Ajuste de zona:** em culturas `quente`, os meses de sementeira e transplante andam −1 mês no `sul` e +1 mês no `interior`. As culturas `fresca` não mudam. A UI diz que é uma aproximação.

**Revisão dos dados:** os valores iniciais vêm de referências públicas (FAO-56 para Kc, guias de horticultura para espaçamento e rendimento, preços recolhidos em lojas portuguesas). Antes do lançamento, alguém da área revê o catálogo. Isto é critério de saída do bloco, não da implementação.

## Regras de cálculo

### 1. Distribuição (`allocate`)

1. **Filtro de luz.** A ordem é `sombra < meia-sombra < sol`. Uma cultura entra se a luz do espaço for ≥ à luz mínima da cultura. As que não entram vão para `excluded` com o motivo (`"precisa de sol pleno"`, `"precisa de pelo menos meia-sombra"`).
2. **Área útil.** `vasos`: 80% de largura × comprimento. `canteiro-elevado` e `terra`: 100%.
3. **Ocupação por planta** (cm²):
   - `vasos` e `spacingCm ≤ 25`: as plantas vão em floreiras de 80 cm, com `perFloreira = floor(80 / spacingCm)`. Ocupação por planta = `80 × 20 / perFloreira`.
   - `vasos` e `spacingCm > 25`: vaso individual, o mais pequeno de `SUPPLIES` com volume ≥ `minPotL`. Ocupação = diâmetro². Se nenhum vaso chegar, usa-se o de 40 L.
   - `canteiro-elevado` e `terra`: `spacingCm²`.
4. **Quantidades.** As culturas com `quantity` ficam como estão e consomem a área primeiro. A área que sobra divide-se em partes iguais pelas culturas sem quantidade: `n = max(1, min(maxUseful, floor(parte / ocupação)))`. Se o teto `maxUseful` deixar área livre, essa área volta a dividir-se pelas culturas ainda abaixo do teto. Repete-se até não mudar nada.
5. **Ocupação.** `usedPct = Σ(n × ocupação) / área útil × 100`. Acima de 100%, junta-se o aviso `"ocupa X% do espaço disponível"`. O cálculo continua.

Saída: `{ crops: { slug, quantity, footprintCm2, container: "floreira-80" | "vaso-10l" | … | null }[], excluded, usableCm2, usedPct, warnings }`.

### 2. Lista de compras (`shopping`)

- **Plantas:** `from = "planta"` → `quantity × price.planta`. `from = "semente"` (ou cultura sem `price.planta`) → `ceil(quantity / seedsPerPacket)` pacotes.
- **Recipientes:** em `vasos`, o número de vasos por tamanho e `ceil(n / perFloreira)` floreiras por cultura.
- **Substrato:** `vasos` = soma dos volumes dos recipientes; `canteiro-elevado` = área em m² × 300 L. Arredonda para sacos de 50 L. `terra` = composto, 10 L/m², em sacos de 50 L.
- **Ferramentas:** `pa-mao`, `luvas`.
- **Rega:** `regador` se `irrigation = "regador"`. Caso contrário, `kit-gota-base` e gotejadores: um por planta em `vasos`, 4 por m² (`DRIPPERS_PER_M2`, arredondado para cima) em canteiro e terra.
- Os itens cujo slug está em `owned` ficam na lista com `owned: true` e saem do total.
- **Total:** `{ min: Σ mínimos, max: Σ máximos, mid: (min + max) / 2 }`, arredondado ao cêntimo. A soma das linhas é sempre igual ao total (critério do PRD).
- **Duráveis:** recipientes, ferramentas e rega são duráveis. Plantas, sementes, substrato e composto são consumíveis. Esta distinção serve à poupança da 2.ª época.

### 3. Rega (`watering`)

Para cada mês `m` (1–12), na zona do input:

- **Ra** (radiação extraterrestre, MJ/m²/dia), FAO-56 eq. 21–25, para o dia 15 do mês e a latitude da zona.
- **ET0** (mm/dia) = `0,0023 × 0,408 × Ra × (Tmédia + 17,8) × √(tMax − tMin)`, com `Tmédia = (tMin + tMax) / 2`.
- **Fator de luz:** `sol` 1, `meia-sombra` 0,75, `sombra` 0,5.
- **Chuva efetiva** (só `canteiro-elevado` e `terra`; os vasos de varanda assumem-se abrigados): `0,8 × precipMm / dias do mês`.
- **Necessidade por planta** (L/dia) = `max(0, ET0 × kc × fatorLuz − chuva) × área de copa em m²` (área de copa = `spacingCm²`; a pegada do vaso subestima a copa de um tomateiro).
- **Só se rega o que está na horta:** cada cultura conta nos meses entre a sementeira ou plantação e o fim da colheita (`cropMonths(crop, zone, from).active`). Para plantas compradas (`from = "planta"`) com meses de transplante não há sementeira (`sow = []`) e a cultura entra na horta no transplante. As perenes (`perennial: true`: morango, hortelã, cebolinho, alecrim, tomilho) contam o ano inteiro.
- **Reserva** (L): vasos e floreiras = `volume do recipiente por planta × 0,2 × 0,5`; canteiro e terra = `ocupação em m² × 300 mm × 0,1 × 0,5`.
- **Dias entre regas** = `clamp(floor(reserva / necessidade), 1, 7)`. Com necessidade 0: "não precisa de rega este mês (a chuva chega)".
- **Litros por rega** = `necessidade × dias entre regas`, arredondado a 0,1 L.
- **Hora:** "antes das 9h". Se `tMax ≥ 30` nesse mês, junta-se "e ao fim da tarde nos vasos pequenos".
- **Gota-a-gota:** `minutos = ceil(litros por rega / 2 L/h × 60)`. Texto: "programa o temporizador para X min, de N em N dias, às 7h00". Em canteiro e terra há 4 gotejadores por m², pelo que cada um debita `ET × kc × luz − chuva` / 4 por dia. Há um só temporizador por mês: corre ao menor intervalo entre regas das culturas agendadas, com os minutos da cultura mais sedenta (`max ceil(litros por dia por gotejador × intervalo / 2 × 60)`). Se a sede por gotejador da mais sedenta for mais de 2× a da menos sedenta, junta-se o aviso "As plantas com menos sede recebem água a mais: põe-nas noutra linha ou usa gotejadores de menor caudal." Os minutos de cada cultura (`dripMinutes`) mantêm-se ao seu próprio intervalo.
- **Resumo:** agrupa as culturas pelo intervalo de rega, por exemplo `"de 2 em 2 dias: tomate (6), pimento (2) — ~1,8 L cada"`. Também mostra o total em litros por semana.

### 4. Calendário (`calendar`)

- Por cultura: `sow` e `transplant` já ajustados à zona. Colheita = para cada mês de plantação (transplante, ou sementeira se não houver transplante), de `mês + floor(daysToHarvest[0] / 30)` a `mês + ceil(daysToHarvest[1] / 30)`, com os meses a dar a volta ao ano.
- **Próximo passo** a partir do mês atual: a primeira ação de sementeira ou transplante nos próximos 12 meses (`"semeia em março"`, `"transplanta já"`).
- **Vista mensal:** 12 entradas `{ month, sow: slug[], transplant: slug[], harvest: slug[] }`.

### 5. Poupança (`savings`)

- **Valor da colheita** = `Σ quantity × yieldKg × marketEurKg`, em intervalo baixo–alto.
- **Poupança na 1.ª época** = `valor − custo total` (min com min, max com max: `[valor.low − custo.max, valor.high − custo.min]`).
- **Custo a partir da 2.ª época** = plantas e sementes (100%) + substrato e composto (30%, para repor). Os duráveis não se repetem.
- **Poupança a partir da 2.ª época** = `valor − custo da 2.ª época`, em intervalo, com a mesma regra da 1.ª.
- **Payback** (semanas), com o valor e o custo centrais:
  - `semanasAtéColheita = média de daysToHarvest das culturas, ponderada pelo valor / 7`
  - `semanasDeColheita = 8` (constante, documentada)
  - `payback = semanasAtéColheita + custo / (valor / semanasDeColheita)`
  - Se `custo > valor`: `payback = null`. O `verdict` é `"paga-se em várias épocas"` quando a poupança a partir da 2.ª época é > 0, e `"não compensa financeiramente"` quando não é. O resultado nunca se esconde.
  - `seasonsToPayback` = 1 se a poupança da 1.ª época (valor central) é ≥ 0; senão, se a da 2.ª em diante é > 0, `1 + ceil(−poupança1.ª / poupança2.ª+)`; senão `null`. É visível em todos os planos (faz parte da resposta principal).
- Por cultura: `{ slug, valueEur: [low, high] }`.
- Tudo leva a etiqueta "estimativa".

## Resultado e gating

`planGarden(input, month)` devolve `GardenResult = { allocation, shopping, watering: MonthWatering[12], calendar, savings }`.

`redactForPlan(result, plan, month)`:

| Campo | Grátis | Standard | Premium |
| --- | --- | --- | --- |
| `allocation`, `shopping` | completo | completo | completo |
| `watering` | só o mês atual | 12 meses | 12 meses |
| `calendar.crops[].next`, `calendar.months` | próximo passo + mês atual | completo | completo |
| `savings` | total 1.ª época + payback + verdict | + 2.ª época + por cultura | igual |

Os campos retirados não vêm na resposta. A resposta traz `locked: string[]` (por exemplo `["watering.year", "calendar.year", "savings.detail"]`), e a UI mostra uma prévia bloqueada com link para `/pricing`. O gating só existe no servidor.

## Persistência

```ts
export const gardens = pgTable("gardens", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  input: json("input").$type<GardenInput>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({ gardensUserIdx: index("gardens_user_idx").on(t.userId) }));
```

Uma migração Drizzle cria `gardens` e apaga `calculations`, `plants` e `products` (vazias na base local, substituídas pelo catálogo). Antes de aplicar em produção, confirmar que estão vazias; se não estiverem, exportar primeiro. Ao ler, o input guardado é validado outra vez. Se um slug deixou de existir, essa cultura sai do cálculo com um aviso, e `getUserGarden` devolve o input já limpo de culturas e material desconhecidos (para o PATCH do talão não falhar). A migração falha de propósito se as tabelas antigas tiverem dados.

## API

Todas as rotas seguem o padrão existente: `getSessionUser`, resposta `{ ok, data }`, 401 sem sessão.

| Rota | Faz |
| --- | --- |
| `POST /api/garden/plan` | Valida o input, corre `planGarden` com o mês de Lisboa e devolve `redactForPlan`. Não grava nada |
| `POST /api/gardens` | `{ name, input }` → cria. Verifica `maxHortas`: 403 `PLAN_LIMIT_EXCEEDED` |
| `GET /api/gardens/[id]` | Input + resultado com o plano já aplicado |
| `PATCH /api/gardens/[id]` | Atualiza `name` e/ou `input` |
| `DELETE /api/gardens/[id]` | Apaga |

Todas as queries filtram por `userId`. O `id` de uma horta de outra pessoa devolve 404.

São removidas: `api/calculator/calculate`, `recalculate`, `save`, `[id]` e `api/calculations`. O `dashboard/summary` e o `user/plan-info` passam a ler de `gardens`.

## Planos e copy

`src/lib/plans.ts` fica só com o que existe:

```ts
interface PlanFeatures {
  name: string; displayName: string;
  maxHortas: number;           // -1 = ilimitado
  fullYearWatering: boolean;
  fullYearCalendar: boolean;
  savingsDetail: boolean;
}
```

Grátis: 3, false, false, false. Standard: −1, true, true, true. Premium: igual ao Standard.

Uma constante `PLAN_COPY` em `plans.ts` gera as listas da landing (`pricing-section.tsx`), de `/pricing` e de `plan-display.tsx`. O Premium aparece como **"Em breve: rega ajustada à meteorologia do IPMA, alertas de geada e calor"**, sem botão de compra. O código do Stripe premium fica como está. As 13 flags sem implementação saem do código, tal como `maxPlantsPerHorta` e `maxPlantsInDatabase`. Também sai o `plan-limits.ts`, exceto o que `POST /api/gardens` usa (`getUserPlan` e a verificação de `maxHortas`).

## UI

Português europeu, tratamento por "tu", mobile primeiro, tokens da marca (sem `bg-white` nem `green-*` fixos).

- **`/calculator`** (um só ecrã, em 3 blocos):
  1. **Espaço:** tipo (3 botões), largura e comprimento em cm, luz (3 botões com as horas), zona (3 botões), rega (2 botões).
  2. **Culturas:** campo de pesquisa. As incompatíveis aparecem riscadas, com o motivo. Cada cultura escolhida tem `auto` ou − / + e um interruptor planta/semente.
  3. **Resultado ao vivo** (ao lado no desktop, por baixo no telemóvel): barra de ocupação, total em intervalo, poupança e payback, rega deste mês, o que fazer este mês, e "Guardar horta" (pede o nome).
  - Pedidos com debounce de 300 ms. O último pedido ganha (`AbortController`). Em caso de erro, o último resultado fica visível com o aviso "não consegui recalcular".
- **`/calculator/result/[id]`** (o talão): lista de compras por grupo com "já tenho" (que grava `owned` via PATCH), tabela de rega (o mês atual, ou 12 meses no Standard), calendário, poupança, prévias bloqueadas e botões Editar e Apagar.
- **Dashboard:** as hortas em linhas, cada uma com o nome, o total central e "este mês: rega de N em N dias · semeia X". Sem hortas: CTA "Planeia a tua primeira horta".

## Testes (`node --test src/lib/garden`)

Os valores esperados são calculados à mão e escritos no teste:

1. 2 × 1 m, vasos, sol, tomate e manjericão em `auto`: quantidades, contentores e `usedPct` esperados.
2. O teto `maxUseful` redistribui a área: com 10 m² de terra, o manjericão fica no teto e a área sobra para a outra cultura.
3. Quantidades manuais acima do espaço dão `usedPct > 100` e um aviso.
4. Com `light = "sombra"`, o tomate vai para `excluded` com o motivo.
5. Um item em `owned` sai do total. A soma das linhas é igual ao total.
6. Ra bate com o exemplo 8 da FAO-56 (20° S, 3 de setembro → 32,2 MJ/m²/dia, ±0,1). A ET0 de julho em Faro fica entre 4,5 e 6,5 mm/dia: o método de Hargreaves subestima no litoral, onde a amplitude térmica é pequena.
7. Os dias entre regas ficam sempre em [1, 7]. Com chuva acima da necessidade em `terra`, a necessidade é 0.
8. O ajuste de zona: tomate no `sul` semeia 1 mês antes do `litoral-norte`, e a alface não muda.
9. A colheita dá a volta ao ano (sementeira em novembro, colheita em fevereiro).
10. Com custo acima do valor, o payback é `null` e o verdict é o certo.
11. `redactForPlan("free")` não tem `watering` com 12 meses e lista os campos em `locked`.
12. A validação rejeita slugs desconhecidos, medidas fora dos limites e mais de 15 culturas.

Script em `package.json`: `"test": "node --test src/lib/garden"`.

## Critérios de aceitação

- [ ] `npm test` passa e `npx tsc --noEmit` não dá erros.
- [ ] Em `/calculator`, a 360 px, 2 × 1 m de vasos ao sol com 3 culturas dá total, rega e payback em menos de 1 segundo depois da última alteração.
- [ ] Um utilizador Grátis não recebe na resposta da API dados de rega de outros meses (confirmado no separador Network).
- [ ] Um utilizador Grátis com 3 hortas recebe 403 ao guardar a 4.ª.
- [ ] A landing, `/pricing` e `plan-display` mostram as mesmas listas, e nenhuma promete uma feature que não exista.
- [ ] O `id` de uma horta de outra pessoa devolve 404 em GET, PATCH e DELETE.
