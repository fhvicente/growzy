# Phase 2 — Migration Strategy (Next.js + Tailwind + shadcn/ui + Better Auth)

Date: 2026-01-31

## 1) Goals & Non‑Goals

### Goals

- Rebuild Mini Horta on Next.js App Router with a clean, modern UI.
- Preserve existing features, flows, and data.
- Replace Laravel auth with Better Auth.
- Maintain Stripe subscription behavior and webhook handling.

### Non‑Goals (for initial migration)

- New features beyond parity.
- Major UX redesign beyond component modernization.

## 2) Target Architecture

### Frontend

- Next.js App Router.
- Tailwind CSS + shadcn/ui components.
- Server Components for data-heavy pages; Client Components only when interactivity is required.

### Backend

- Next.js Route Handlers for API endpoints (REST).
- ORM: Drizzle with PostgreSQL.
- Stripe SDK in server-only context.

### Auth

- Better Auth with email/password, password reset, and email verification.
- Session strategy: Better Auth default (database or JWT-based, depending on chosen adapter).

## 3) Information Architecture & Routing (App Router)

### Public

- / → Landing page
- /pricing → Subscription plans

### Auth

- /login
- /register
- /forgot-password
- /reset-password
- /verify-email
- /confirm-password (if needed for sensitive actions)

### App (Authenticated)

- /calculator
- /calculator/result/[id]
- /dashboard
- /profile
- /subscription/success
- /subscription/cancel

### Admin

- /admin/webhook-logs (gated by role/email)

## 4) Component Hierarchy (High‑Level)

- App layout
    - Header/Nav
    - Footer
- Pages
    - Landing: hero, features, how-it-works, CTA
    - Calculator: plant selection, quantity input, add/remove items, calculate action
    - Result: summary table, product selection, totals, save/update actions
    - Dashboard: stats cards, recent calculations table
    - Profile: update profile, update password, delete account
    - Pricing: subscription plan cards
    - Admin: webhook logs table

## 5) Data Model & DB Migration Strategy

### Strategy

- Start with schema parity to existing data model.
- Introduce Drizzle schema mapped to current tables.
- Migrate data into PostgreSQL using a one-time export/import script (SQLite → Postgres).

### Tables (Parity)

- users, plants, products, calculations, subscriptions, webhook_logs
- auth tables required by Better Auth (depends on adapter)

### Migration Steps

1. Define Drizzle schema based on Phase 1 inventory.
2. Generate migrations.
3. Provision PostgreSQL (Docker for local/dev).
4. Export existing SQLite data and import into PostgreSQL.
5. Validate data integrity (counts, sums, relationships).

## 6) API Design (Route Handlers)

### Calculator

- POST /api/calculator/calculate
- POST /api/calculator/recalculate
- POST /api/calculator/save
- DELETE /api/calculator/[id]
- GET /api/calculator/[id]

### Dashboard

- GET /api/dashboard/summary
- GET /api/calculations

### Subscription

- POST /api/subscription/checkout
- GET /api/subscription/success
- GET /api/subscription/cancel
- POST /api/stripe/webhook

### Admin

- GET /api/admin/webhook-logs

## 7) State Management

- Prefer Server Components and server actions where appropriate.
- Client state for calculator UI interactions (selected plants, quantities, product checkboxes).
- Use React Hook Form + Zod for validation in client forms.

## 8) Authentication & Authorization (Better Auth)

- Email/password registration, login, password reset, email verification.
- Auth middleware for protected routes.
- Subscription guard: check active subscription before allowing calculator actions.
- Admin guard: role-based or email-based allowlist (replace hardcoded email as soon as possible).

## 9) Stripe Integration

- Use Stripe Checkout for subscription creation.
- Store `stripe_customer_id`, `stripe_subscription_id`, `stripe_status` on user/subscription.
- Webhook handling for subscription updates/deletes.
- Persist webhook logs to `webhook_logs`.

## 10) Testing Strategy

- Unit: calculation logic, subscription status logic.
- Integration: API routes for calculator, subscription flows.
- E2E: critical paths (register → subscribe → calculate → save → dashboard).

## 11) Deployment Pipeline

- Dockerize Next.js + PostgreSQL for consistent deploys.
- Build: Next.js build on CI (Docker image build).
- DB migrations before deploy (Drizzle migrate in container).
- Environment variables managed via hosting provider or Docker secrets.
- Configure Stripe webhooks to new endpoint.

## 12) Rollback Plan

- Keep Laravel app and DB intact during parallel run.
- Use feature flag or DNS cutover strategy.
- Roll back by switching traffic back to legacy deployment.

## 13) Timeline & Milestones (Suggested)

- Milestone 1: Project scaffold + auth (Better Auth) + DB schema.
- Milestone 2: Calculator + Results.
- Milestone 3: Dashboard + Profile.
- Milestone 4: Stripe Checkout + Webhooks.
- Milestone 5: Admin logs + QA + launch.

---

Next step: Phase 3 Implementation once you approve this strategy.
