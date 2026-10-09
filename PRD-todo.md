# PRD — Growzy: Tarefas da horta (to-do)

6 out 2026 · Flávio Vicente

Uma lista de tarefas por horta: "regar os tomates", "comprar substrato", "semear alface". É a primeira coisa na Growzy que faz a pessoa voltar durante a época e não só antes da primeira compra. Também é a base onde a Feature 3 do `PRD.md` (calendário e lembretes) vai assentar mais tarde: um lembrete passa a ser só uma tarefa criada pela app.

## Contexto e problema

- **Hoje não há motivo para voltar à app.** Fazes o cálculo, guardas e acabou. O dashboard (`src/app/[locale]/(protected)/dashboard/page.tsx`) ainda mostra dados fictícios.
- **O `PRD.md` prevê uma tabela `reminders` e uma vista "Esta semana"** (Fase 2, jan–fev 2027). Se o to-do for construído à parte, ficamos com duas listas de "coisas para fazer". Este PRD junta as duas: há uma só tabela `tasks`, e os lembretes automáticos entram nela mais tarde.
- **Ainda não existe a entidade horta.** Uma horta guardada é uma linha de `calculations`. A tabela `gardens` só chega na Fase 1 do `PRD.md`. Por isso, a tarefa liga-se por agora a `calculations.id` e a ligação é opcional.

## Objetivos

1. Dar um motivo para abrir a app pelo menos uma vez por semana durante a época.
2. Ter a estrutura de dados que os lembretes automáticos do `PRD.md` vão usar, sem a refazer depois.
3. Construir em menos de 1 semana, sem dependências novas.

**Não-objetivos (nesta versão)**

- Notificações por email ou push. O código não tem nenhum serviço de email (o `PRD.md` diz que o SendGrid já está previsto, mas não há nada em `src/` nem no `package.json`). Fica para a Fase 2.
- Tarefas geradas automaticamente a partir do calendário ou da meteorologia.
- Subtarefas, etiquetas, prioridades, anexos, partilha com outras pessoas.
- Recorrência complexa (dias da semana, "último domingo do mês"). Só "repetir a cada N dias".

## Utilizadores e casos de uso

As mesmas pessoas do `PRODUCT.md`: hortas de varanda ou de terraço, no telemóvel, muitas vezes de pé.

1. **"Tenho de comprar o que falta."** Depois do cálculo, a pessoa cria tarefas de compra a partir da lista ("comprar 20 L de substrato").
2. **"Rego de 2 em 2 dias."** Cria "Regar varanda", que se repete a cada 2 dias. Quando a marca como feita, aparece a próxima.
3. **"O que tenho para fazer hoje?"** Abre a app e vê as tarefas de hoje e as atrasadas no topo.
4. **"Já semeei?"** As tarefas feitas ficam no histórico da horta, com data.

## Requisitos funcionais

**Tarefa**

| Campo | Obrigatório | Notas |
| --- | --- | --- |
| Título | Sim | Até 120 caracteres |
| Horta | Não | Uma das hortas guardadas, ou "Geral" |
| Data | Não | Só dia, sem hora. Sem data, a tarefa fica em "Sem data" |
| Repetir a cada N dias | Não | 1 a 60. Só pode ser definido se houver data |
| Nota | Não | Até 500 caracteres |

**Comportamento**

- Marcar como feita guarda `done_at`. Se a tarefa se repete, é criada a próxima com data = **dia em que foi feita** + N. Exemplo: rega de 2 em 2 dias com data dia 10, feita só no dia 12, passa para dia 14 e não para dia 12. É assim que a rega funciona na prática.
- Desmarcar uma tarefa feita volta a pô-la pendente. Se já tinha gerado a próxima e essa ainda não foi feita, a próxima é apagada, para não ficar repetida.
- Apagar uma tarefa que se repete apaga só aquela. Para parar a repetição, edita-se a tarefa e tira-se o "repetir".
- Apagar uma horta (`calculations`) passa as tarefas dela para "Geral". Não as apaga.

**Vistas**

- **Página `/tasks`** (nova entrada "Tarefas" no `header.tsx`). Grupos por esta ordem: Atrasadas, Hoje, Próximos 7 dias, Mais tarde, Sem data. As feitas ficam escondidas num "Feitas (12)" que se abre.
- **Filtro por horta**, por cima da lista.
- **Criação rápida:** um campo no topo com o título e Enter. A data, a horta e a repetição ficam num detalhe opcional. No telemóvel, cria-se uma tarefa com 1 campo e 1 toque.
- **Dashboard:** um cartão "Hoje" com as tarefas atrasadas e de hoje (máximo 5) e um link para `/tasks`.
- **Resultado do cálculo** (`calculator/result/[id]`): um botão "Criar tarefas de compra" que cria uma tarefa por produto da lista, ligadas à horta e sem data. Isto só faz sentido depois de a Fase 0 do `PRD.md` corrigir o cálculo. Até lá a lista inclui todos os produtos da base.

**Texto da UI** (português europeu, trata por "tu", como no `PRODUCT.md`)

- Lista vazia: "Nada para fazer. Aproveita a sombra."
- Atrasada: "atrasada 2 dias", e não um vermelho alarmante.
- Repetição: "repete a cada 2 dias".

## Planos

**Proposta: as tarefas manuais existem em todos os planos.** A regra do `PRD.md` é "o grátis calcula, o pago acompanha". Mas um to-do manual sem lembretes é barato de manter e é o que traz a pessoa de volta: só se converte quem volta. O que se paga é a app fazer o trabalho por ti.

| | Grátis | Standard | Premium |
| --- | --- | --- | --- |
| Tarefas manuais | Até 20 pendentes | Ilimitadas | Ilimitadas |
| Repetição a cada N dias | Sim | Sim | Sim |
| Tarefas de compra a partir do cálculo | Sim | Sim | Sim |
| Tarefas automáticas do calendário (Fase 2 do `PRD.md`) | — | Sim | Sim |
| Lembrete por email (Fase 2) | — | Sim | Sim |
| Rega ajustada ao IPMA (Fase 3) | — | — | Sim |

O limite de 20 entra em `PlanFeatures` (`src/lib/plans.ts`) como `maxOpenTasks`, e é verificado na rota de criação, do mesmo modo que `checkPlantLimit` em `src/lib/plan-limits.ts`.

## Modelo de dados

Uma tabela nova em `src/lib/schema.ts`, com uma migração Drizzle.

```ts
export const tasks = pgTable(
	"tasks",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
		calculationId: integer("calculation_id").references(() => calculations.id, { onDelete: "set null" }),
		title: varchar("title", { length: 120 }).notNull(),
		note: varchar("note", { length: 500 }),
		dueOn: date("due_on"),
		repeatEveryDays: integer("repeat_every_days"),
		source: varchar("source", { length: 20 }).default("manual").notNull(), // manual | shopping | calendar | weather
		doneAt: timestamp("done_at"),
		nextTaskId: integer("next_task_id"), // a cópia criada ao concluir; permite desfazer
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
	},
	(t) => ({
		tasksUserDueIdx: index("tasks_user_due_idx").on(t.userId, t.doneAt, t.dueOn),
	}),
);
```

- `source` existe já para que os lembretes automáticos do `PRD.md` sejam tarefas com `source = 'calendar'` ou `'weather'`. A tabela `reminders` prevista no `PRD.md` deixa de ser precisa.
- `calculationId` passa a `gardenId` quando a tabela `gardens` existir. A migração da Fase 1 do `PRD.md` converte uma coluna na outra.
- Restrições na base de dados: `CHECK (repeat_every_days BETWEEN 1 AND 60)` e `CHECK (repeat_every_days IS NULL OR due_on IS NOT NULL)`.

## API

Segue o padrão de `src/app/api/calculations/route.ts`: `getSessionUser`, resposta `{ ok, data }` e 401 sem sessão.

| Rota | Faz |
| --- | --- |
| `GET /api/tasks?calculationId=&status=open\|done` | Lista as tarefas do utilizador |
| `POST /api/tasks` | Cria uma tarefa. Verifica o limite do plano |
| `POST /api/tasks/bulk` | Cria as tarefas de compra a partir de um cálculo (`{ calculationId }`) |
| `PATCH /api/tasks/[id]` | Edita a tarefa, ou marca/desmarca como feita (`{ done: true }`) |
| `DELETE /api/tasks/[id]` | Apaga a tarefa |

**Segurança**

- Todas as queries filtram por `user_id` da sessão. Um `id` de outra pessoa devolve 404, não 403.
- Ao criar ou editar, `calculationId` tem de pertencer ao utilizador.
- O título e a nota são validados no servidor (tamanho, não vazios) e mostrados como texto, nunca como HTML.
- Concluir uma tarefa que se repete faz duas escritas (marcar como feita e criar a próxima) numa só transação, para que um duplo toque não crie duas cópias. Se a tarefa já tem `done_at`, o pedido não faz nada.

**"Hoje" em que fuso?** Em `Europe/Lisbon`. O público é português, e os Açores ficam uma hora atrás, o que só afeta tarefas por volta da meia-noite. Se for preciso, mais tarde passa-se a usar o fuso do browser.

## Métricas

| Métrica | Como se mede | Meta |
| --- | --- | --- |
| Adoção | % de utilizadores ativos com pelo menos 1 tarefa criada | A definir após 4 semanas |
| Regresso semanal | % de quem tem tarefas e abre a app em 3 das 4 semanas seguintes | A definir |
| Conclusão | Tarefas feitas ÷ tarefas com data já passada | Acima de 50% |
| Limite do Grátis | % de utilizadores Grátis que chegam às 20 pendentes | Se for acima de 10%, rever o limite |

Para medir isto chegam queries à tabela `tasks` e ao `sessions.updatedAt`. Não é preciso ferramenta de analytics nova.

## Faseamento

Encaixa antes da Fase 1 do `PRD.md`, ou em paralelo com ela. Não depende de templates nem de preços.

1. **v1 · To-do manual** (out 2026 · ~1 semana)
    - Tabela `tasks`, migração e rotas da API
    - Página `/tasks`, entrada no header e cartão "Hoje" no dashboard
    - Repetição a cada N dias e limite do Grátis
    - ◆ Critério para avançar: concluir e desfazer uma tarefa que se repete não deixa cópias repetidas nem órfãs
2. **v1.1 · Tarefas de compra** (depois da Fase 0 do `PRD.md`)
    - Botão "Criar tarefas de compra" no resultado do cálculo
3. **v2 · Tarefas automáticas** (= Fase 2 do `PRD.md`, jan–fev 2027)
    - O calendário por zona cria tarefas com `source = 'calendar'`
    - Email diário com as tarefas de hoje. Implica escolher e integrar um serviço de email
4. **v3 · Meteorologia** (= Fase 3 do `PRD.md`)
    - As tarefas de rega com `source = 'weather'` são canceladas ou antecipadas conforme o IPMA

## Critérios de aceitação (v1)

- [ ] Uma tarefa sem horta e sem data aparece em "Sem data".
- [ ] Uma tarefa com data de ontem e por fazer aparece em "Atrasadas".
- [ ] Concluir "Regar" (a cada 2 dias, data dia 10) no dia 12 cria uma nova tarefa para dia 14.
- [ ] Desmarcar essa tarefa apaga a do dia 14, se ainda não estiver feita.
- [ ] Dois pedidos seguidos de "concluir" criam só uma cópia.
- [ ] Um utilizador Grátis com 20 pendentes recebe um 403 com `code: "PLAN_LIMIT_EXCEEDED"` ao criar a 21.ª.
- [ ] `GET`, `PATCH` e `DELETE` com o `id` de uma tarefa de outra pessoa devolvem 404.
- [ ] Apagar uma horta deixa as tarefas dela em "Geral".
- [ ] A página `/tasks` funciona a 360 px de largura, por teclado e com leitor de ecrã (cada checkbox tem o título da tarefa como label).

## Riscos e questões em aberto

| Risco | Mitigação |
| --- | --- |
| Lista manual cai em desuso depois da 1.ª semana | Sem lembretes isto é provável. A v2 (tarefas automáticas e email) é o que resolve, por isso não deve ficar adiada para depois da época |
| Duas listas de tarefas no futuro | Uma só tabela `tasks`, com `source`. Atualizar o `PRD.md` para tirar `reminders` |
| A ligação a `calculations` tem de mudar para `gardens` | Coluna opcional e migração simples na Fase 1 |

**Questões em aberto**

- [ ] As tarefas manuais ficam mesmo no Grátis, ou passam só para o Standard?
- [ ] O limite de 20 pendentes no Grátis é o número certo?
- [ ] Que serviço de email usar na v2 (Resend, SendGrid, SES)? Hoje não há nenhum no código.
- [ ] Atualizar o `PRD.md`: tirar a tabela `reminders` e apontar a Feature 3 para `tasks`.
