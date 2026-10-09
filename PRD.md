# PRD — Growzy: Templates, Reminders, Forecasts and AI

2 Oct 2026 · Flávio Vicente

This PRD turns Growzy from a single-use calculator into an assistant for the whole season. At its core is the **space → garden engine**: the person enters the measurements, the light and the zone, and Growzy says how many plants fit, what to buy, how much it costs, how much and when to water, when to sow and harvest, and whether it pays off. On top of that come real prices, weather-aware reminders and, finally, AI. The Free plan answers today's question; the paid plans cover the whole season and keep up with it.

> Updated 7 Oct 2026: added Feature 0 (engine), templates become pre-filled engine inputs, the plans table and the phasing were aligned. Technical spec: `docs/superpowers/specs/2026-10-07-motor-horta-design.md`.

## Context and problem

Today Growzy calculates the cost of a garden from fixed prices in the `plants` and `products` tables. There are four problems:

- **The original idea doesn't exist.** The calculator doesn't ask for measurements, light or zone, and uses 5 plants hardcoded. It doesn't say how many plants fit or when to water.
- **The calculation is wrong by default.** `src/app/api/calculator/calculate/route.ts` adds every product in the database to every calculation, whether or not that garden needs it.
- **Prices have no source or date.** The user has no reason to trust the total, and `PRODUCT.md` requires numbers the person can trust.
- **There is no recurring value.** A calculation is done once per season, so a monthly subscription isn't justified.
- **The landing page promises what doesn't exist.** "Planeamento com IA" (AI planning), "Previsões de colheita" (harvest forecasts) and "Alertas personalizados" (personalised alerts) appear under Premium without being built. This violates the honest-copy principle.

## Goals and metrics

**Goals**

1. Give the user a total they trust, with each item's price shown alongside its source and date.
2. Bring the user back to the app throughout the season (March to October), not just before the first purchase.
3. Justify each paid plan with value that repeats every week.

**Non-goals (in this version)**

- Own shop or product checkout.
- Real-time prices obtained by scraping.
- Pest diagnosis from photos.
- Native app: email reminders and web push are enough.

**Metrics**

| Metric | How it's measured | Target |
| --- | --- | --- |
| Activation | % of sign-ups who save a garden from a template in the 1st session | To be set after 4 weeks of baseline |
| Weekly retention | % of users active in week 4 | To be set |
| Paid conversion | % of Free users who move to Standard or Premium within 30 days | To be set |
| Price trust | Median deviation between the estimated total and the spend the user records | Under 20% |
| Seasonal churn | Cancellations between November and February | Below the in-season monthly average |

The targets still to be set depend on a baseline that doesn't exist yet: current usage data comes from a single user.

## Users and use cases

The audience is people in Portugal with a balcony, terrace or small backyard. They aren't agronomists and use the app mostly on their phone, often standing up, at the garden centre or on the balcony.

| Profile | Situation | What they need | Likely plan |
| --- | --- | --- | --- |
| Balcony beginner | 1–2 m², never planted | Know what to buy and how much it costs | Free → Standard |
| Regular grower | Terrace or planters, 2nd or 3rd season | Calendar, watering reminders and spend tracking | Standard |
| Backyard garden | 4–20 m², several crops | Per-bed planning, harvest forecast and weather alerts | Premium |

**Main use cases**

1. "I have 1 m² on a south-facing balcony. What do I plant and how much will I spend?" The user picks a template and gets the shopping list with the total.
2. "Tell me when to water." The user gets a reminder that doesn't show up on days when it rains.
3. "When will I harvest the tomatoes?" The app shows the forecast harvest window and the expected quantity.
4. "Set me up a garden for 3 m² with partial shade and a €60 budget." The AI proposes a plan, which the user can edit and save.
5. "Was it worth it?" The app compares what the user spent with the value of what they harvested.

## Plan structure

Each paid plan adds a layer: Standard follows the season and Premium adapts to the user's specific garden. Prices stay the same (€4,99 and €9,99 per month), and the landing page only shows a feature once it's in production.

| Feature | Free | Standard (€4,99/month · €39/year) | Premium (€9,99/month · €79/year) |
| --- | --- | --- | --- |
| Space → garden engine (layout, shopping list, cost) | Yes | Yes | Yes |
| Saved gardens | 3 | Unlimited | Unlimited |
| Calculated watering (litres, frequency, time, drip) | Current month | 12 months | 12 months + daily IPMA adjustment |
| Calendar by zone | Current month + next step | 12 months | Same |
| Savings and payback | 1st season total and payback | + 2nd season and per-crop detail | Same |
| Reminders (watering, sowing) | — | Email, fixed time | Adjusted to IPMA, frost and heat alerts |
| Spend and harvest tracking | — | Yes | Yes + multi-season history |
| AI planning | — | — | With monthly limit |
| Export | — | Shopping list PDF | Shopping list and season plan PDF |

Only what's already in production appears on the landing page and `/pricing`. Until Phase 3 exists, Premium appears as "Em breve" (Coming soon), with no buy button. The lists on the landing page, `/pricing` and `plan-display.tsx` all come from a single constant in `src/lib/plans.ts`.

**Seasonality.** Most balcony gardens stop between November and February, so monthly subscriptions can be expected to be cancelled in November. To counter this:

- **Annual plan featured.** On the pricing page, annual is the default option.
- **Season pass.** One-off payment covering March to October, priced somewhere between €25 and €30 for Standard.
- **Winter use.** Planning the next season, winter crops (cabbages, broad beans, garlic) and the review of the season just ended.

## Feature 0 — Space → garden engine

The heart of the product. Every number comes from written, tested rules, not from AI. Full detail, formulas and tests in the spec `docs/superpowers/specs/2026-10-07-motor-horta-design.md`.

**Input:** space type (pots, raised bed, ground), width × length in cm, light (sun ≥6 h, partial shade 3–6 h, shade <3 h), zone (litoral-norte, interior, sul), watering (watering can or drip), chosen crops (automatic or manual quantity, plant or seed) and the gear the person already has.

**What it calculates**

| Output | Rule (summary) |
| --- | --- |
| Compatible crops | Only those that tolerate the space's light are included; the others appear struck through with the reason |
| How many fit | Usable area (80% in pots) divided among the crops; footprint = spacing² in a bed, pot diameter² or planter fraction in pots; per-cell cap (`maxUseful`) |
| Containers and substrate | Smallest pot ≥ the crop's minimum volume, 80 cm planters for crops with spacing ≤ 25 cm; substrate in 50 L bags |
| Cost | Range (sum of minimums to sum of maximums), only with what this garden needs, minus what the person already has |
| Watering | ET0 via Hargreaves with the zone's IPMA climate normals × Kc (FAO-56) × light factor × plant area; days between waterings from the container's water reserve (1 to 7); litres per watering; time; drip timer minutes |
| Calendar | Sowing and transplant months adjusted to the zone; harvest window; what to do each month |
| Savings | Expected harvest × supermarket €/kg − cost; 1st season and following ones (without durables); weeks until the garden pays for itself, or "não compensa" (doesn't pay off), without hiding it |

**Data:** a git-versioned catalogue (`src/lib/garden/catalog.ts`) with around 30 crops typical of Portuguese balconies, gear with price, shop and date, and climate by zone. It replaces the `plants` and `products` tables. Someone from the field reviews the values before launch.

**Acceptance criterion:** on a phone, a 2 × 1 m balcony with 3 crops gives the total, the month's watering and payback in under 1 second; the sum of the lines equals the total; Free doesn't receive Standard-only data from the API.

## Feature 1 — Real prices

Every price now has a range, a source and a verification date. The app shows "€8–12 · verificado em out/2026" (verified Oct 2026) instead of a single value with no origin.

**Sources, by phase**

1. **Manual collection (MVP).** Around 50 base items: substrate, pots, planters, seeds, plants in trays, watering can, trowel, gloves and drip irrigation. Prices come from 4 to 6 shops (for example Leroy Merlin, AKI, Continente, Lidl and a local garden centre) and are reviewed at the start of each season and halfway through.
2. **Reported spend.** When recording a purchase, the user enters the shop and the price paid. With 5 or more records per item and region (district), the app shows the median price.
3. **Affiliates (later phase).** Links to shops get an affiliate code where a programme exists. The rules and any API for each programme are still to be confirmed.

**Requirements**

- Each price stores minimum, maximum, shop, URL, verification date and origin (`manual`, `reported` or `affiliate`).
- A price older than 180 days shows the warning "preço pode estar desatualizado" (price may be out of date).
- A simple admin panel lets prices be edited without touching the code.
- Reported spend is validated: a value 3× above or below the median is left out of the calculation.
- The garden total is shown as a range (sum of minimums to sum of maximums), and the central estimate uses the median.

**Out of scope:** scraping. It breaks whenever the shop changes its site and usually violates the terms of use.

## Feature 2 — Templates by size

> With Feature 0, the grouped shopping list, «já tenho» (I already have it) and the substrate calculation move into the engine. A template becomes just a pre-filled engine input (space, light and crops) that the person opens and adjusts. Deferred until after Phase 1.

The user picks the space, light and style, and gets a garden ready to buy.

**Initial templates (8)**

| Template | Area | Light | Example plants | Plan |
| --- | --- | --- | --- | --- |
| Herb balcony | 1 m² | Sun or partial shade | Basil, parsley, mint, chives | Free |
| Salad planter | 1 planter of 80 cm | Partial shade | Lettuce, rocket, radish | Free |
| Summer balcony | 2 m² | Full sun | Cherry tomato, pepper, basil | Standard |
| Mediterranean terrace | 4 m² | Full sun | Tomato, courgette, aubergine, herbs | Standard |
| Vertical garden | 1×2 m wall | Sun or partial shade | Strawberries, lettuce, herbs | Standard |
| Raised bed | 1,2×0,8 m | Full sun | Seasonal rotating mix | Standard |
| Small backyard | 10 m² | Full sun | Potato, green beans, cabbage, onion | Standard |
| Winter garden | 2 m² | Any | Cabbage, broad beans, garlic, spinach | Standard |

**Requirements**

- A template defines plants and quantities, containers (pots, planters or bed), substrate, tools and watering.
- Substrate is calculated in litres from the container volume, using the `pot_size_required` and `soil_amount_required` fields that already exist in `plants`.
- The shopping list is split into 4 groups (plants and seeds, containers and substrate, tools, watering), and each item shows the price range and the shop.
- The user marks what they already have (for example "já tenho regador" — I already have a watering can), that item drops out of the total, and the choice is saved for future gardens.
- A template can be edited after being chosen (swap plants, change quantities) and saved as the user's garden.
- The Free plan sees all templates, but Standard ones appear locked, with the total visible and the full list hidden.

**Acceptance criterion:** in a template, the total equals the sum of the shopping list lines, and no product that isn't in the template is included in the total.

## Feature 3 — Calendar and reminders

The app now says what to do this week in each garden. On Premium, watering reminders take the IPMA forecast into account, so there's no prompt to water on a rainy day.

**Calendar** (the static per-zone version comes in Feature 0; this covers the «Esta semana» (This week) view with real gardens and dates)

- Each plant has sowing, transplant and harvest windows per climate zone. 3 zones are enough to start: North and central coast, Interior, and South and islands.
- The zone is chosen in the profile from the municipality.
- The "Esta semana" (This week) view lists the tasks for all gardens: sow, transplant, fertilise and harvest.

**Reminders**

| Type | Standard | Premium |
| --- | --- | --- |
| Watering | Frequency calculated by the engine for the month (Feature 0) | Same, but the reminder is cancelled when precipitation probability ≥ 70% and brought forward when the max ≥ 32 °C |
| Sowing and transplant | At the start of each window | Same, with each garden's date |
| Frost | — | With forecast min ≤ 2 °C: "protege as plantas esta noite" (protect your plants tonight) |
| IPMA warnings | — | Yellow or higher for hot weather, wind or rain in the district |
| Weekly summary | Email on Monday | Same |

**Weather data source.** The [IPMA open data API](https://api.ipma.pt/) provides a 5-day daily forecast per location, with `precipitaProb`, `tMin` and `tMax`, and 3-day weather warnings. The terms require always citing the source, and IPMA asks that an email be sent to `webmaster@ipma.pt` describing the usage. The app shows "Dados: IPMA" (Data: IPMA) next to each weather-based reminder.

**Technical requirements**

- A daily job at 07:00 (Lisbon time) makes 1 request per location with active users, caches the response for the day and generates the reminders.
- Channels: email (SendGrid, already planned in the code) and web push. The user chooses the channels and the time they want to receive reminders.
- Each reminder has the actions "feito" (done) and "adiar 1 dia" (snooze 1 day). Marking a watering reminder "feito" is recorded in the garden's history.
- By default, there's no more than 1 notification per day per user: the day's reminders are grouped into one.

## Feature 4 — Tracking and harvest forecast

The harvest forecast uses simple, transparent rules, with no machine learning model in the first version. The forecast date is the planting date plus each plant's days to harvest, and the quantity comes from an average yield per plant. The app always makes clear that it's an estimate.

**Tracking (Standard)**

- The user enters the actual date they planted each plant and whether they sowed or transplanted.
- They can record harvests with date, plant and quantity in grams or units.
- They can record spend with item, shop and amount, and this data feeds the reported prices of Feature 1.

**Forecast**

| Output | Standard | Premium | Calculation |
| --- | --- | --- | --- |
| Harvest window | Yes | Yes | Planting date + `days_to_harvest_min` to `days_to_harvest_max` |
| Expected quantity | — | Yes | No. of plants × `yield_per_plant` (low–high range) |
| Weather adjustment | — | Yes | The window shifts back 1 day for every 3 days with a max below 15 °C (heuristic to be validated) |
| Projected savings | — | Yes | Expected quantity × supermarket price per kg, minus the garden cost |
| Actual savings | — | Yes | Recorded harvests × price per kg, minus recorded spend |

**Requirements**

- The `plants` table gains days to harvest (minimum and maximum), yield per plant (low and high) and supermarket price per kg with source and date.
- Yield values come from public, cited agronomic sources. With 3 or more seasons of data, they are recalibrated with the harvests recorded by users.
- The dashboard shows a season timeline: what has already been harvested and what is forecast.
- The `estimated_savings` field of `calculations` is now calculated by these rules (today it defaults to `0`).

## Feature 5 — AI planning (Premium)

The AI builds a garden plan from natural language, but doesn't make up plants or prices. It can only choose plants and products that exist in the database, and the server calculates the total with the Feature 1 prices.

**What it does**

1. **Tailored plan.** The user writes, for example, "3 m², east-facing balcony, partial shade, €60, I like tomatoes and herbs". The AI returns a structured plan with plants, quantities, containers and a short rationale for each choice. The plan opens in the same editor as the templates.
2. **Questions about the garden.** "Why are the tomato leaves yellow?" The AI answers with the context of the user's garden (plants, dates, last recorded watering, the week's weather).
3. **Next season plan.** At the end of the season, the AI proposes crop rotation and adjustments based on the recorded harvests.

**Technical design**

- The AI uses the Anthropic API with tool use. The `propose_plan` tool receives only `plant_id`, `product_id` and quantities, and the server rejects any id that doesn't exist.
- The request sends the filtered catalogue (plants compatible with the user's light and zone), not the whole database.
- Model: Claude Sonnet 5.5 for the plan, and Claude Haiku 4.5 for short questions.
- The plan is validated after generation: the total must stay within budget (+10%) and the plants must fit in the area (area per plant defined in `plants`). If it fails, the AI gets 1 retry with the error. If it fails again, the app shows the closest template.
- Answers about pests or diseases always include the note "confirma num viveiro se o problema continuar" (check with a garden centre if the problem persists).

**Limits per Premium user (proposal)**

| Usage | Monthly limit |
| --- | --- |
| Plans generated | 10 |
| Questions | 100 |

The limits exist to keep the cost per user below a fraction of the €9,99. The right value is only set after measuring tokens per request in the beta.

## Data model and architecture

The garden becomes its own entity, `gardens`, which stores the engine input. The result (quantities, cost, watering, calendar, savings) is always recalculated from the input and the catalogue. Agronomic data lives in the git catalogue, not in the database. Everything stays in Postgres with Drizzle, with no new services beyond IPMA and the Anthropic API.

| Table | Phase | Main columns |
| --- | --- | --- |
| `gardens` | 0 (replaces `calculations`) | `user_id`, `name`, `input` (engine JSON: space, light, zone, watering, crops, gear already owned) |
| `plants`, `products` | 0 (removed) | Replaced by the catalogue `src/lib/garden/catalog.ts` |
| `prices` | 1 (if the catalogue is no longer enough) | `item_slug`, `store`, `url`, `min`, `max`, `source` (manual/reported/affiliate), `checked_at`, `district` |
| `garden_plantings` | 2 | `garden_id`, `crop_slug`, `planted_at`, `method` (semente/transplante — seed/transplant): actual dates per crop, for reminders and forecast |
| `expenses` | 2 | `user_id`, `garden_id`, `item_id`, `store`, `amount`, `paid_at` |
| `harvests` | 2 | `garden_id`, `plant_id`, `quantity`, `unit` (g/un), `harvested_at` |
| `tasks` | 2 | See `PRD-todo.md`; reminders are tasks with `source` = `calendar` or `weather` |
| `ai_usage` | 3 | `user_id`, `month`, `plans`, `questions`, `tokens` |

**Architecture**

- **Plan gating.** The configuration in `src/lib/plans.ts` reads `users.subscription_plan` and is called in the API routes. Hiding the feature only in the frontend isn't enough.
- **Calculation.** An engine of pure functions (`src/lib/garden`) runs only on the server (`POST /api/garden/plan`). Paid data is stripped from the response on the server (`redactForPlan`), never just hidden in the UI.
- **Scheduled jobs.** A daily cron generates the reminders (IPMA) and a weekly cron sends the summary. On Fly, this can be a scheduled machine or a protected endpoint called by an external cron.
- **Migration.** `calculations`, `plants` and `products` are empty in the local database; confirm in production before removing them in Phase 0 (if they have data, export first).

## Phasing and roadmap

Phases 0 and 1 must be done before March 2027, because that's when most people buy for their garden. The dates are a proposal and assume one person developing full-time.

1. **Phase 0 · Space → garden engine** (Oct–Nov 2026 · 2–3 weeks)
    - Catalogue of crops, gear and climate by zone
    - Engine: layout, shopping list, watering, calendar and savings, with tests
    - `gardens` table, new routes and removal of `calculations`, `plants` and `products`
    - `plans.ts` with only what exists; landing page and `/pricing` from the same constant; Premium «Em breve» (Coming soon)
    - ◆ Gate: engine tests pass, total = sum of lines, Free doesn't receive Standard data
2. **Phase 1 · Real prices and templates** (Dec 2026) — deadline set by the season
    - Review of the catalogue data by someone from the field
    - Prices verified at 4 to 6 shops, warning at 180 days
    - Templates as pre-filled inputs
    - ◆ Gate: catalogue reviewed before March
3. **Phase 2 · Reminders and tracking** (Jan–Feb 2027)
    - «Esta semana» (This week) view, tasks (`PRD-todo.md`) and email reminders from the engine
    - Spend and harvest tracking
    - ◆ Gate: no duplicate reminders over 2 weeks of beta
4. **Phase 3 · Premium** (Mar–May 2027)
    - Watering adjusted to IPMA (same formula, with forecast tMin and tMax and forecast precipitation), frost and heat alerts
    - AI planning in beta, with monthly limits
    - ◆ Gate: Premium can only be bought once it exists

Each phase only starts once the previous phase's gate has been met.

## Risks and open questions

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Manual prices go out of date | Total stops being trustworthy | Warning at 180 days, review 2× per season, reported spend as a second source |
| Few reported purchases per district | Regional median never appears | Minimum of 5 records and, below that, show the national median |
| Winter churn | Revenue drops between November and February | Annual featured, season pass, winter crops |
| AI cost higher than expected | Negative Premium margin | Monthly limits, Haiku for questions, measurement in beta before launch |
| AI gives wrong pest advice | Loss of trust | Answers tied to the garden context and a note to check with a garden centre |
| Harvest forecast is way off | Frustrated expectations | Show ranges and recalibrate with recorded harvests |
| IPMA API unavailable | Reminders lose their adjustment | Use the fixed frequency (Standard behaviour) and warn "sem dados meteorológicos hoje" (no weather data today) |

**Open questions**

- [ ] Season pass price: €25 or €30?
- [ ] Which reference shops for manual collection, and who does the collecting?
- [ ] Which agronomic source to use for yields and days to harvest?
- [ ] Are 3 climate zones enough, or are more needed?
- [ ] Which Portuguese shops have an affiliate programme with an API?
- [ ] Does Free keep 3 gardens or go down to 1, now that templates exist?
- [ ] Does web push go into the MVP, or do we start with email only?
- [ ] Send the usage registration email to IPMA (`webmaster@ipma.pt`).

## Sources

- [IPMA — open data API](https://api.ipma.pt/): daily forecast per location, weather warnings and terms of use.
- Growzy code: `src/lib/schema.ts`, `src/app/api/calculator/calculate/route.ts`, `src/components/landing/pricing-section.tsx` and `PRODUCT.md`.
