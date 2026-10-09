# PRD — Growzy: Garden tasks (to-do)

6 Oct 2026 · Flávio Vicente

A task list per garden: "regar os tomates" (water the tomatoes), "comprar substrato" (buy potting soil), "semear alface" (sow lettuce). It is the first thing in Growzy that brings people back during the season and not only before the first purchase. It is also the foundation that Feature 3 of `PRD.md` (calendar and reminders) will build on later: a reminder becomes just a task created by the app.

## Context and problem

- **Today there is no reason to come back to the app.** You run the calculation, save it and that's it. The dashboard (`src/app/[locale]/(protected)/dashboard/page.tsx`) still shows fake data.
- **`PRD.md` plans a `reminders` table and a "Esta semana" (This week) view** (Phase 2, Jan–Feb 2027). If the to-do is built separately, we end up with two lists of "things to do". This PRD merges them: there is a single `tasks` table, and automatic reminders go into it later.
- **The garden entity does not exist yet.** A saved garden is a row in `calculations`. The `gardens` table only arrives in Phase 1 of `PRD.md`. So for now the task links to `calculations.id` and the link is optional.

## Goals

1. Give a reason to open the app at least once a week during the season.
2. Have the data structure that the automatic reminders in `PRD.md` will use, without redoing it later.
3. Build it in under 1 week, with no new dependencies.

**Non-goals (in this version)**

- Email or push notifications. The code has no email service (`PRD.md` says SendGrid is already planned, but there is nothing in `src/` or in `package.json`). Deferred to Phase 2.
- Tasks generated automatically from the calendar or the weather.
- Subtasks, tags, priorities, attachments, sharing with other people.
- Complex recurrence (weekdays, "last Sunday of the month"). Only "repeat every N days".

## Users and use cases

The same people as in `PRODUCT.md`: balcony or terrace gardens, on the phone, often standing up.

1. **"I need to buy what's missing."** After the calculation, the person creates shopping tasks from the list ("comprar 20 L de substrato" (buy 20 L of potting soil)).
2. **"I water every 2 days."** Creates "Regar varanda" (Water balcony), which repeats every 2 days. When marked as done, the next one appears.
3. **"What do I have to do today?"** Opens the app and sees today's and overdue tasks at the top.
4. **"Have I sown yet?"** Completed tasks stay in the garden's history, with a date.

## Functional requirements

**Task**

| Field | Required | Notes |
| --- | --- | --- |
| Title | Yes | Up to 120 characters |
| Garden | No | One of the saved gardens, or "Geral" (General) |
| Date | No | Day only, no time. Without a date, the task goes into "Sem data" (No date) |
| Repeat every N days | No | 1 to 60. Can only be set if there is a date |
| Note | No | Up to 500 characters |

**Behaviour**

- Marking as done stores `done_at`. If the task repeats, the next one is created with date = **day it was done** + N. Example: watering every 2 days dated the 10th, done only on the 12th, moves to the 14th and not the 12th. That is how watering works in practice.
- Unchecking a completed task makes it pending again. If it had already generated the next one and that one is not done yet, the next one is deleted, so it is not duplicated.
- Deleting a repeating task deletes only that one. To stop the repetition, edit the task and remove the "repetir" (repeat).
- Deleting a garden (`calculations`) moves its tasks to "Geral" (General). It does not delete them.

**Views**

- **`/tasks` page** (new "Tarefas" (Tasks) entry in `header.tsx`). Groups in this order: Atrasadas (Overdue), Hoje (Today), Próximos 7 dias (Next 7 days), Mais tarde (Later), Sem data (No date). Completed tasks are hidden in an expandable "Feitas (12)" (Done (12)).
- **Filter by garden**, above the list.
- **Quick add:** a field at the top with the title and Enter. Date, garden and repetition go in an optional detail. On the phone, a task is created with 1 field and 1 tap.
- **Dashboard:** a "Hoje" (Today) card with overdue and today's tasks (max 5) and a link to `/tasks`.
- **Calculation result** (`calculator/result/[id]`): a "Criar tarefas de compra" (Create shopping tasks) button that creates one task per product in the list, linked to the garden and with no date. This only makes sense after Phase 0 of `PRD.md` fixes the calculation. Until then the list includes every product in the database.

**UI copy** (European Portuguese, addresses the user as "tu", as in `PRODUCT.md`)

- Empty list: "Nada para fazer. Aproveita a sombra." (Nothing to do. Enjoy the shade.)
- Overdue: "atrasada 2 dias" (2 days overdue), not an alarming red.
- Repetition: "repete a cada 2 dias" (repeats every 2 days).

## Plans

**Proposal: manual tasks exist on all plans.** The rule in `PRD.md` is "free calculates, paid tracks". But a manual to-do without reminders is cheap to maintain and is what brings people back: only those who come back convert. What you pay for is the app doing the work for you.

| | Free | Standard | Premium |
| --- | --- | --- | --- |
| Manual tasks | Up to 20 open | Unlimited | Unlimited |
| Repeat every N days | Yes | Yes | Yes |
| Shopping tasks from the calculation | Yes | Yes | Yes |
| Automatic calendar tasks (Phase 2 of `PRD.md`) | — | Yes | Yes |
| Email reminder (Phase 2) | — | Yes | Yes |
| Watering adjusted to IPMA (Phase 3) | — | — | Yes |

The limit of 20 goes into `PlanFeatures` (`src/lib/plans.ts`) as `maxOpenTasks`, and is checked in the create route, the same way as `checkPlantLimit` in `src/lib/plan-limits.ts`.

## Data model

A new table in `src/lib/schema.ts`, with a Drizzle migration.

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
		nextTaskId: integer("next_task_id"), // the copy created on completion; allows undo
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
	},
	(t) => ({
		tasksUserDueIdx: index("tasks_user_due_idx").on(t.userId, t.doneAt, t.dueOn),
	}),
);
```

- `source` exists already so that the automatic reminders in `PRD.md` are tasks with `source = 'calendar'` or `'weather'`. The `reminders` table planned in `PRD.md` is no longer needed.
- `calculationId` becomes `gardenId` once the `gardens` table exists. The Phase 1 migration in `PRD.md` converts one column into the other.
- Database constraints: `CHECK (repeat_every_days BETWEEN 1 AND 60)` and `CHECK (repeat_every_days IS NULL OR due_on IS NOT NULL)`.

## API

Follows the pattern of `src/app/api/calculations/route.ts`: `getSessionUser`, `{ ok, data }` response and 401 without a session.

| Route | Does |
| --- | --- |
| `GET /api/tasks?calculationId=&status=open\|done` | Lists the user's tasks |
| `POST /api/tasks` | Creates a task. Checks the plan limit |
| `POST /api/tasks/bulk` | Creates the shopping tasks from a calculation (`{ calculationId }`) |
| `PATCH /api/tasks/[id]` | Edits the task, or marks/unmarks it as done (`{ done: true }`) |
| `DELETE /api/tasks/[id]` | Deletes the task |

**Security**

- All queries filter by the session's `user_id`. Another person's `id` returns 404, not 403.
- On create or edit, `calculationId` must belong to the user.
- Title and note are validated on the server (length, non-empty) and rendered as text, never as HTML.
- Completing a repeating task does two writes (mark as done and create the next one) in a single transaction, so a double tap does not create two copies. If the task already has `done_at`, the request does nothing.

**"Today" in which time zone?** In `Europe/Lisbon`. The audience is Portuguese, and the Azores are one hour behind, which only affects tasks around midnight. If needed, the browser's time zone can be used later.

## Metrics

| Metric | How it is measured | Target |
| --- | --- | --- |
| Adoption | % of active users with at least 1 task created | To be set after 4 weeks |
| Weekly return | % of those with tasks who open the app in 3 of the following 4 weeks | To be set |
| Completion | Tasks done ÷ tasks with a past date | Above 50% |
| Free limit | % of Free users who reach 20 open tasks | If above 10%, review the limit |

Queries on the `tasks` table and `sessions.updatedAt` are enough to measure this. No new analytics tool is needed.

## Phasing

Fits before Phase 1 of `PRD.md`, or in parallel with it. Does not depend on templates or prices.

1. **v1 · Manual to-do** (Oct 2026 · ~1 week)
    - `tasks` table, migration and API routes
    - `/tasks` page, header entry and "Hoje" (Today) card on the dashboard
    - Repeat every N days and the Free limit
    - ◆ Criterion to move on: completing and undoing a repeating task leaves no duplicate or orphaned copies
2. **v1.1 · Shopping tasks** (after Phase 0 of `PRD.md`)
    - "Criar tarefas de compra" (Create shopping tasks) button on the calculation result
3. **v2 · Automatic tasks** (= Phase 2 of `PRD.md`, Jan–Feb 2027)
    - The per-zone calendar creates tasks with `source = 'calendar'`
    - Daily email with today's tasks. Requires choosing and integrating an email service
4. **v3 · Weather** (= Phase 3 of `PRD.md`)
    - Watering tasks with `source = 'weather'` are cancelled or brought forward based on IPMA

## Acceptance criteria (v1)

- [ ] A task with no garden and no date appears in "Sem data" (No date).
- [ ] A task dated yesterday and not done appears in "Atrasadas" (Overdue).
- [ ] Completing "Regar" (Water) (every 2 days, dated the 10th) on the 12th creates a new task for the 14th.
- [ ] Unchecking that task deletes the one for the 14th, if it is not done yet.
- [ ] Two consecutive "complete" requests create only one copy.
- [ ] A Free user with 20 open tasks gets a 403 with `code: "PLAN_LIMIT_EXCEEDED"` when creating the 21st.
- [ ] `GET`, `PATCH` and `DELETE` with the `id` of another person's task return 404.
- [ ] Deleting a garden leaves its tasks in "Geral" (General).
- [ ] The `/tasks` page works at 360 px width, by keyboard and with a screen reader (each checkbox has the task title as its label).

## Risks and open questions

| Risk | Mitigation |
| --- | --- |
| Manual list falls out of use after the 1st week | Without reminders this is likely. v2 (automatic tasks and email) is what fixes it, so it should not be pushed past the season |
| Two task lists in the future | A single `tasks` table, with `source`. Update `PRD.md` to remove `reminders` |
| The link to `calculations` has to change to `gardens` | Optional column and a simple migration in Phase 1 |

**Open questions**

- [ ] Do manual tasks really stay on Free, or move to Standard only?
- [ ] Is the limit of 20 open tasks on Free the right number?
- [ ] Which email service to use in v2 (Resend, SendGrid, SES)? There is none in the code today.
- [ ] Update `PRD.md`: remove the `reminders` table and point Feature 3 to `tasks`.
