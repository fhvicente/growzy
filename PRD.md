# PRD — Growzy: Templates, Lembretes, Previsões e IA

2 out 2026 · Flávio Vicente

Este PRD transforma a Growzy de uma calculadora de uso único num assistente para a época inteira: templates por tamanho, preços reais, lembretes, previsões e planeamento com IA. A ideia de fundo é simples: o plano Grátis calcula, os planos pagos acompanham.

## Contexto e problema

Hoje a Growzy calcula o custo de uma horta a partir de preços fixos nas tabelas `plants` e `products`. Há quatro problemas:

- **O cálculo está errado por defeito.** `src/app/api/calculator/calculate/route.ts` soma todos os produtos da base a qualquer cálculo, sejam ou não precisos para aquela horta.
- **Os preços não têm fonte nem data.** O utilizador não tem razão para confiar no total, e o `PRODUCT.md` exige números em que a pessoa confie.
- **Não há valor recorrente.** Um cálculo faz-se uma vez por época, por isso uma subscrição mensal não se justifica.
- **A landing promete o que não existe.** "Planeamento com IA", "Previsões de colheita" e "Alertas personalizados" aparecem no Premium sem estarem construídos. Isto viola o princípio de copy honesta.

## Objetivos e métricas

**Objetivos**

1. Dar ao utilizador um total em que confie, com o preço de cada item acompanhado da fonte e da data.
2. Fazer o utilizador voltar à app durante a época inteira (março a outubro), não só antes da primeira compra.
3. Justificar cada plano pago com valor que se repete todas as semanas.

**Não-objetivos (nesta versão)**

- Loja própria ou checkout de produtos.
- Preços em tempo real obtidos por scraping.
- Diagnóstico de pragas por fotografia.
- App nativa: lembretes por email e web push chegam.

**Métricas**

| Métrica | Como se mede | Meta |
| --- | --- | --- |
| Ativação | % de registos que guardam uma horta a partir de um template na 1.ª sessão | A definir após 4 semanas de baseline |
| Retenção semanal | % de utilizadores ativos na semana 4 | A definir |
| Conversão paga | % de Grátis que passam a Standard ou Premium em 30 dias | A definir |
| Confiança no preço | Desvio mediano entre o total estimado e o gasto que o utilizador regista | Menos de 20% |
| Churn sazonal | Cancelamentos entre novembro e fevereiro | Abaixo da média mensal da época |

As metas a definir dependem de uma baseline que ainda não existe: os dados de uso atuais são de um único utilizador.

## Utilizadores e casos de uso

O público são pessoas em Portugal com varanda, terraço ou um pequeno quintal. Não são agrónomos e usam a app sobretudo no telemóvel, muitas vezes de pé, no viveiro ou na varanda.

| Perfil | Situação | O que precisa | Plano provável |
| --- | --- | --- | --- |
| Principiante de varanda | 1–2 m², nunca plantou | Saber o que comprar e quanto custa | Grátis → Standard |
| Cultivador regular | Terraço ou floreiras, 2.ª ou 3.ª época | Calendário, lembretes de rega e registo de gastos | Standard |
| Horta de quintal | 4–20 m², várias culturas | Planeamento por canteiro, previsão de colheita e alertas de meteorologia | Premium |

**Casos de uso principais**

1. "Tenho 1 m² numa varanda virada a sul. O que planto e quanto gasto?" O utilizador escolhe um template e recebe a lista de compras com o total.
2. "Diz-me quando regar." O utilizador recebe um lembrete que não aparece nos dias em que chove.
3. "Quando vou colher os tomates?" A app mostra a janela prevista de colheita e a quantidade esperada.
4. "Monta-me uma horta para 3 m² com meia sombra e €60 de orçamento." A IA propõe um plano, que o utilizador pode editar e guardar.
5. "Valeu a pena?" A app compara o que o utilizador gastou com o valor do que colheu.

## Estrutura de planos

Cada plano pago acrescenta uma camada: o Standard acompanha a época e o Premium adapta-se à horta concreta do utilizador. Os preços mantêm-se (€4,99 e €9,99 por mês), e a landing só mostra uma feature depois de ela estar em produção.

| Feature | Grátis | Standard (€4,99/mês · €39/ano) | Premium (€9,99/mês · €79/ano) |
| --- | --- | --- | --- |
| Hortas guardadas | 3 | Ilimitadas | Ilimitadas |
| Templates por tamanho | 2 (varanda 1 m², floreira) | Todos | Todos + template à medida pela IA |
| Lista de compras | Total e itens principais | Lista completa: plantas, substrato em litros, vasos, ferramentas e rega | Preço por loja com link |
| Preços | Intervalo com fonte e data | Igual | Igual + preço mediano reportado por outros utilizadores na região |
| Calendário | — | Sementeira e transplante por zona climática | Ajustado às plantas e à data de cada horta |
| Lembretes | — | Rega e sementeira por email ou push, com horário fixo | Rega ajustada à meteorologia, alertas de geada e calor |
| Registo | — | Gastos e colheitas | Igual + histórico de várias épocas |
| Previsão de colheita | — | Janela prevista por planta | Janela + quantidade estimada + poupança projetada |
| Planeamento com IA | — | — | Plano a partir de espaço, luz e orçamento, mais perguntas à IA (com limite mensal) |
| Exportação | — | PDF da lista de compras | PDF da lista e do plano da época |

**Sazonalidade.** A maior parte das hortas de varanda para entre novembro e fevereiro, por isso é de esperar que as subscrições mensais sejam canceladas em novembro. Para o contrariar:

- **Plano anual em destaque.** Na página de preços, o anual aparece como opção por defeito.
- **Passe de época.** Pagamento único que cobre março a outubro, com preço a definir entre €25 e €30 no Standard.
- **Uso no inverno.** Planear a próxima época, culturas de inverno (couves, favas, alhos) e o balanço da época que acabou.

## Feature 1 — Preços reais

Cada preço passa a ter um intervalo, uma fonte e uma data de verificação. A app mostra "€8–12 · verificado em out/2026" em vez de um valor único sem origem.

**Fontes, por fase**

1. **Recolha manual (MVP).** São cerca de 50 itens base: substrato, vasos, floreiras, sementes, plantas em tabuleiro, regador, pá, luvas e rega gota-a-gota. Os preços vêm de 4 a 6 lojas (por exemplo Leroy Merlin, AKI, Continente, Lidl e um viveiro local) e são revistos no início de cada época e a meio dela.
2. **Gastos reportados.** Quando regista um gasto, o utilizador indica a loja e o preço que pagou. Com 5 ou mais registos por item e região (distrito), a app mostra o preço mediano.
3. **Afiliados (fase posterior).** Os links para as lojas passam a ter código de afiliado onde existir programa. As regras e a eventual API de cada programa ficam por confirmar.

**Requisitos**

- Cada preço guarda mínimo, máximo, loja, URL, data de verificação e origem (`manual`, `reported` ou `affiliate`).
- Um preço com mais de 180 dias aparece com o aviso "preço pode estar desatualizado".
- Um painel de administração simples permite editar preços sem mexer no código.
- Os gastos reportados são validados: um valor 3× acima ou abaixo da mediana fica de fora do cálculo.
- O total da horta é apresentado como intervalo (soma dos mínimos a soma dos máximos), e a estimativa central usa a mediana.

**Fora de âmbito:** scraping. Quebra sempre que a loja muda o site e costuma violar os termos de uso.

## Feature 2 — Templates por tamanho e lista de compras

O utilizador escolhe o espaço, a luz e o estilo, e recebe uma horta pronta a comprar. A lista de compras só inclui o que aquela horta precisa, e isso corrige o cálculo que hoje soma todos os produtos.

**Templates iniciais (8)**

| Template | Área | Luz | Exemplo de plantas | Plano |
| --- | --- | --- | --- | --- |
| Varanda de ervas | 1 m² | Sol ou meia sombra | Manjericão, salsa, hortelã, cebolinho | Grátis |
| Floreira de saladas | 1 floreira de 80 cm | Meia sombra | Alface, rúcula, rabanete | Grátis |
| Varanda de verão | 2 m² | Sol pleno | Tomate-cereja, pimento, manjericão | Standard |
| Terraço mediterrânico | 4 m² | Sol pleno | Tomate, curgete, beringela, ervas | Standard |
| Horta vertical | Parede de 1×2 m | Sol ou meia sombra | Morangos, alface, ervas | Standard |
| Canteiro elevado | 1,2×0,8 m | Sol pleno | Mistura rotativa por época | Standard |
| Quintal pequeno | 10 m² | Sol pleno | Batata, feijão-verde, couve, cebola | Standard |
| Horta de inverno | 2 m² | Qualquer | Couve, favas, alho, espinafre | Standard |

**Requisitos**

- Um template define plantas e quantidades, recipientes (vasos, floreiras ou canteiro), substrato, ferramentas e rega.
- O substrato é calculado em litros a partir do volume dos recipientes, usando os campos `pot_size_required` e `soil_amount_required` que já existem em `plants`.
- A lista de compras divide-se em 4 grupos (plantas e sementes, recipientes e substrato, ferramentas, rega), e cada item mostra o intervalo de preço e a loja.
- O utilizador marca o que já tem (por exemplo "já tenho regador"), esse item sai do total, e a escolha fica guardada para as hortas seguintes.
- Um template pode ser editado depois de escolhido (trocar plantas, mudar quantidades) e guardado como horta do utilizador.
- O plano Grátis vê todos os templates, mas os do Standard aparecem bloqueados, com o total visível e a lista completa escondida.

**Critério de aceitação:** num template, o total é igual à soma das linhas da lista de compras, e nenhum produto que não esteja no template entra no total.

## Feature 3 — Calendário e lembretes

A app passa a dizer o que fazer esta semana em cada horta. No Premium, os lembretes de rega têm em conta a previsão do IPMA, por isso não há aviso para regar num dia de chuva.

**Calendário (Standard)**

- Cada planta tem janelas de sementeira, transplante e colheita por zona climática. Para começar chegam 3 zonas: Norte e litoral centro, Interior, e Sul e ilhas.
- A zona é escolhida no perfil a partir do concelho.
- A vista "Esta semana" lista as tarefas de todas as hortas: semear, transplantar, adubar e colher.

**Lembretes**

| Tipo | Standard | Premium |
| --- | --- | --- |
| Rega | Frequência fixa por planta (ex.: a cada 2 dias no verão) | Igual, mas o lembrete é cancelado com probabilidade de precipitação ≥ 70% e antecipado com máxima ≥ 32 °C |
| Sementeira e transplante | No início de cada janela | Igual, com a data de cada horta |
| Geada | — | Com mínima prevista ≤ 2 °C: "protege as plantas esta noite" |
| Avisos IPMA | — | Amarelo ou superior para tempo quente, vento ou chuva no distrito |
| Resumo semanal | Email à segunda-feira | Igual |

**Fonte dos dados meteorológicos.** A [API de dados abertos do IPMA](https://api.ipma.pt/) dá previsão diária a 5 dias por localidade, com `precipitaProb`, `tMin` e `tMax`, e avisos meteorológicos a 3 dias. Os termos obrigam a citar sempre a fonte, e o IPMA pede que se envie um email para `webmaster@ipma.pt` a descrever o uso. A app mostra "Dados: IPMA" junto de cada lembrete baseado em meteorologia.

**Requisitos técnicos**

- Um job diário às 07:00 (hora de Lisboa) faz 1 pedido por localidade com utilizadores ativos, guarda a resposta em cache durante o dia e gera os lembretes.
- Canais: email (SendGrid, já previsto no código) e web push. O utilizador escolhe os canais e a hora em que quer receber os lembretes.
- Cada lembrete tem as ações "feito" e "adiar 1 dia". Marcar "feito" num lembrete de rega fica registado no histórico da horta.
- Por defeito, não há mais de 1 notificação por dia por utilizador: os lembretes do dia são agrupados numa só.

## Feature 4 — Acompanhamento e previsão de colheita

A previsão de colheita usa regras simples e transparentes, sem modelo de machine learning na primeira versão. A data prevista vem da data de plantio somada aos dias até à colheita de cada planta, e a quantidade vem de um rendimento médio por planta. A app mostra sempre que se trata de uma estimativa.

**Registo (Standard)**

- O utilizador indica a data real em que plantou cada planta e se semeou ou transplantou.
- Pode registar colheitas com data, planta e quantidade em gramas ou unidades.
- Pode registar gastos com item, loja e valor, e estes dados alimentam os preços reportados da Feature 1.

**Previsão**

| Saída | Standard | Premium | Cálculo |
| --- | --- | --- | --- |
| Janela de colheita | Sim | Sim | Data de plantio + `days_to_harvest_min` a `days_to_harvest_max` |
| Quantidade esperada | — | Sim | N.º de plantas × `yield_per_plant` (intervalo baixo–alto) |
| Ajuste por meteorologia | — | Sim | A janela atrasa 1 dia por cada 3 dias com máxima abaixo de 15 °C (heurística a validar) |
| Poupança projetada | — | Sim | Quantidade esperada × preço de supermercado por kg, menos o custo da horta |
| Poupança real | — | Sim | Colheitas registadas × preço por kg, menos os gastos registados |

**Requisitos**

- A tabela `plants` passa a ter dias até à colheita (mínimo e máximo), rendimento por planta (baixo e alto) e preço de supermercado por kg com fonte e data.
- Os valores de rendimento vêm de fontes agronómicas públicas e citadas. Com 3 ou mais épocas de dados, são recalibrados com as colheitas registadas pelos utilizadores.
- O dashboard mostra uma linha do tempo da época: o que já foi colhido e o que está previsto.
- O campo `estimated_savings` de `calculations` passa a ser calculado por estas regras (hoje tem valor por defeito `0`).

## Feature 5 — Planeamento com IA (Premium)

A IA monta um plano de horta a partir de linguagem natural, mas não inventa plantas nem preços. Só pode escolher plantas e produtos que existem na base, e é o servidor que calcula o total com os preços da Feature 1.

**O que faz**

1. **Plano à medida.** O utilizador escreve, por exemplo, "3 m², varanda virada a nascente, meia sombra, €60, gosto de tomate e ervas". A IA devolve um plano estruturado com plantas, quantidades, recipientes e uma justificação curta para cada escolha. O plano abre no mesmo editor dos templates.
2. **Perguntas sobre a horta.** "Porque é que as folhas do tomate estão amarelas?" A IA responde com o contexto da horta do utilizador (plantas, datas, última rega registada, meteorologia da semana).
3. **Plano da próxima época.** No fim da época, a IA propõe a rotação de culturas e ajustes com base nas colheitas registadas.

**Desenho técnico**

- A IA usa a API da Anthropic com tool use. A ferramenta `propose_plan` recebe apenas `plant_id`, `product_id` e quantidades, e o servidor rejeita qualquer id que não exista.
- O pedido envia o catálogo filtrado (plantas compatíveis com a luz e a zona do utilizador), não a base inteira.
- Modelo: Claude Sonnet 5.5 para o plano, e Claude Haiku 4.5 para as perguntas curtas.
- O plano é validado depois de gerado: o total tem de ficar dentro do orçamento (+10%) e as plantas têm de caber na área (área por planta definida em `plants`). Se falhar, a IA tem 1 nova tentativa com o erro. Se falhar outra vez, a app mostra o template mais próximo.
- Respostas sobre pragas ou doenças incluem sempre a nota "confirma num viveiro se o problema continuar".

**Limites por utilizador Premium (proposta)**

| Uso | Limite mensal |
| --- | --- |
| Planos gerados | 10 |
| Perguntas | 100 |

Os limites servem para manter o custo por utilizador abaixo de uma fração dos €9,99. O valor certo só se fixa depois de medir os tokens por pedido no beta.

## Modelo de dados e arquitetura

A horta passa a ser uma entidade própria, `gardens`, com linhas por planta e por produto. Hoje uma horta guardada é uma linha em `calculations` com JSON, e isso não chega para registar datas de plantio por planta nem lembretes. Tudo continua em Postgres com Drizzle, sem serviços novos além do IPMA e da API da Anthropic.

| Tabela | Nova / alterada | Colunas principais |
| --- | --- | --- |
| `plants` | Alterada | + `days_to_harvest_min/max`, `yield_per_plant_low/high`, `area_per_plant_m2`, `light` (sol, meia sombra, sombra), `water_every_days`, `market_price_per_kg` |
| `plant_calendar` | Nova | `plant_id`, `zone`, `sow_from/to`, `transplant_from/to` (mês e dia) |
| `products` | Alterada | + `category` (recipiente, substrato, ferramenta, rega), `volume_liters` |
| `prices` | Nova | `item_type` (plant/product), `item_id`, `store`, `url`, `min`, `max`, `source` (manual/reported/affiliate), `checked_at`, `district` |
| `templates` | Nova | `slug`, `name`, `area_m2`, `light`, `tier` (free/standard), `items` (plantas e produtos com quantidades) |
| `gardens` | Nova (substitui o uso de `calculations`) | `user_id`, `template_id`, `name`, `area_m2`, `light`, `concelho`, `zone` |
| `garden_items` | Nova | `garden_id`, `item_type`, `item_id`, `quantity`, `planted_at`, `owned` (já tem) |
| `expenses` | Nova | `user_id`, `garden_id`, `item_id`, `store`, `amount`, `paid_at` |
| `harvests` | Nova | `garden_id`, `plant_id`, `quantity`, `unit` (g/un), `harvested_at` |
| `reminders` | Nova | `garden_id`, `kind`, `due_on`, `status` (pending/done/snoozed/cancelled), `reason` |
| `ai_usage` | Nova | `user_id`, `month`, `plans`, `questions`, `tokens` |

**Arquitetura**

- **Gating por plano.** Uma função única `can(user, feature)` lê `users.subscription_plan` e é chamada nas rotas da API. Esconder a feature só no frontend não chega.
- **Cálculo.** As rotas `calculate` e `recalculate` passam a receber uma horta ou um template e a somar apenas os seus `garden_items`, com os preços de `prices`.
- **Jobs agendados.** Um cron diário gera os lembretes (IPMA) e um cron semanal envia o resumo. No Fly, isto pode ser uma máquina agendada ou um endpoint protegido chamado por cron externo.
- **Migração.** Cada linha de `calculations` passa a uma `gardens` com os seus `garden_items`. `calculations` fica só de leitura durante 1 versão e depois é removida.

## Faseamento e roadmap

As Fases 0 e 1 têm de estar concluídas antes de março de 2027, porque é quando a maioria das pessoas compra para a horta. As datas são uma proposta e assumem uma pessoa a desenvolver a tempo inteiro.

1. **Fase 0 · Corrigir a base** (out 2026 · 1–2 semanas)
    - Cálculo soma só os produtos de cada horta
    - Landing sem features que ainda não existem
    - Função `can(user, feature)` nas rotas da API
    - ◆ Portão: total = soma das linhas em todos os cálculos
2. **Fase 1 · Templates e preços** (nov–dez 2026) — prazo imposto pela época
    - Tabelas `prices`, `templates`, `gardens` e `garden_items`
    - 50 itens com preço verificado e 8 templates
    - Lista de compras por grupo, com «já tenho»
    - ◆ Portão: Standard passa a incluir templates e lista completa
3. **Fase 2 · Calendário e lembretes** (jan–fev 2027)
    - Calendário por zona e vista «Esta semana»
    - Lembretes de rega e sementeira por email
    - Registo de gastos e colheitas
    - ◆ Portão: lembretes sem duplicados em 2 semanas de beta
4. **Fase 3 · Premium** (mar–mai 2027)
    - Rega ajustada ao IPMA, alertas de geada e calor
    - Previsão de colheita e poupança
    - Planeamento com IA em beta, com limites mensais
    - ◆ Portão: Premium na landing só depois de medir o custo da IA

Cada fase só começa depois de o portão da fase anterior estar cumprido.

## Riscos e questões em aberto

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Preços manuais ficam desatualizados | Total deixa de ser confiável | Aviso aos 180 dias, revisão 2× por época, gastos reportados como segunda fonte |
| Poucos gastos reportados por distrito | Mediana regional nunca aparece | Mínimo de 5 registos e, abaixo disso, mostrar a mediana nacional |
| Churn no inverno | Receita cai entre novembro e fevereiro | Anual em destaque, passe de época, culturas de inverno |
| Custo da IA acima do previsto | Margem do Premium negativa | Limites mensais, Haiku nas perguntas, medição no beta antes do lançamento |
| IA dá conselho errado sobre pragas | Perda de confiança | Respostas presas ao contexto da horta e nota para confirmar num viveiro |
| Previsão de colheita falha muito | Expectativa frustrada | Mostrar intervalos e recalibrar com as colheitas registadas |
| API do IPMA indisponível | Lembretes ficam sem ajuste | Usar a frequência fixa (comportamento Standard) e avisar "sem dados meteorológicos hoje" |

**Questões em aberto**

- [ ] Preço do passe de época: €25 ou €30?
- [ ] Quais as lojas de referência para a recolha manual, e quem faz a recolha?
- [ ] Que fonte agronómica usar para rendimentos e dias até à colheita?
- [ ] Bastam 3 zonas climáticas, ou são precisas mais?
- [ ] Que lojas portuguesas têm programa de afiliados com API?
- [ ] O Grátis fica com 3 hortas ou passa a 1, agora que existem templates?
- [ ] O web push entra no MVP, ou começamos só com email?
- [ ] Enviar o email de registo de uso ao IPMA (`webmaster@ipma.pt`).

## Fontes

- [IPMA — API de dados abertos](https://api.ipma.pt/): previsão diária por localidade, avisos meteorológicos e termos de uso.
- Código da Growzy: `src/lib/schema.ts`, `src/app/api/calculator/calculate/route.ts`, `src/components/landing/pricing-section.tsx` e `PRODUCT.md`.
