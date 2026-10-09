# Growzy

Plan your small vegetable garden before you go to the garden centre.

Tell Growzy the space you have (size, type, sunlight, region of the country) and what you want to grow. It answers with:

- **How many plants fit** and how to split the area between crops
- **Shopping list and total cost** (containers, soil, tools, irrigation), as a price range
- **Watering plan** month by month, including a timer setting for drip irrigation
- **Calendar** for sowing, transplanting and harvesting in your region
- **Savings**: what the harvest is worth and how many seasons until the garden pays for itself

Built for balconies, terraces and small backyards in Portugal, used on a phone, by people who aren't agronomists. The app itself is in European Portuguese.

## Plans

| | Free | Standard (€4.99/month) |
| --- | --- | --- |
| Saved gardens | 3 | unlimited |
| Watering and calendar | current month | full year |
| Savings | total and payback | per crop, 1st and 2nd season |

Results are computed on the server and trimmed to the user's plan: paid content never reaches the browser of a free user.

## Stack

- **Next.js 16** (App Router, React 19), **Tailwind CSS 4**, **GSAP** for motion
- **PostgreSQL 16** + **Drizzle ORM**
- **Better Auth** (email and password)
- **Stripe** (subscription checkout and webhooks)
- Routes under `/pt` and `/en`

## Structure

```
src/lib/garden/             garden engine, pure and tested (allocate, shopping, watering, calendar, savings, plan)
src/lib/garden/catalog.ts   agronomic data: crops, supplies, climate per region (with sources)
src/app/[locale]/           pages: landing, pricing, auth, calculator, dashboard, profile, admin
src/app/api/                garden/plan, gardens (CRUD), subscription, stripe/webhook, admin
src/lib/schema.ts           Drizzle tables
drizzle/                    SQL migrations
```

The `/admin` panel (accounts listed in `ADMIN_EMAILS`) has KPIs, users, Stripe webhook logs with reprocessing, catalog prices and an audit log.

## Running locally

Requirements: Node 25+, Docker.

1. Create `.env`:

   ```
   POSTGRES_PASSWORD=postgres
   DATABASE_URL=postgres://postgres:postgres@localhost:5433/growzy
   BETTER_AUTH_SECRET=<long random string>
   BETTER_AUTH_BASE_URL=http://localhost:3000
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_STANDARD_PRICE_ID=price_...
   STRIPE_PREMIUM_PRICE_ID=price_...
   ADMIN_EMAILS=you@example.com
   ```

2. Start Postgres, apply migrations and run the app:

   ```
   docker compose up -d db
   npm install
   npm run db:migrate
   npm run dev
   ```

3. To test payments, forward Stripe webhooks:

   ```
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

`docker compose up --build` also runs the app in a container on port 3000.

## Tests

```
npm test               # garden engine (node:test, no database)
npm run test:api:setup # once: creates the growzy_test database
npm run test:api       # API routes against the test database (uses .env.test)
```

## Database

```
npm run db:generate   # generate a migration from src/lib/schema.ts
npm run db:migrate    # apply migrations
npm run db:studio     # Drizzle Studio
```

## Docs

- [`PRODUCT.md`](PRODUCT.md): audience, tone and principles
- [`PRD.md`](PRD.md): requirements and roadmap
- [`DESIGN.md`](DESIGN.md): visual system
