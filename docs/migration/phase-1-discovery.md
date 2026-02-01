# Phase 1 — Discovery & Feature Inventory (Mini Horta)

Date: 2026-01-31

## 1) High-Level Overview

Mini Horta (Horta Fácil) is a Laravel web app that helps users estimate the cost of building a small urban garden. The app includes a paid subscription (Stripe) that gates access to the calculator and saved results.

Key source references:

- Routes: [routes/web.php](routes/web.php) and [routes/auth.php](routes/auth.php)
- Controllers: [app/Http/Controllers/CalculatorController.php](app/Http/Controllers/CalculatorController.php), [app/Http/Controllers/SubscriptionController.php](app/Http/Controllers/SubscriptionController.php), [app/Http/Controllers/ProfileController.php](app/Http/Controllers/ProfileController.php), [app/Http/Controllers/WebhookLogController.php](app/Http/Controllers/WebhookLogController.php)
- Models: [app/Models/User.php](app/Models/User.php), [app/Models/Calculation.php](app/Models/Calculation.php), [app/Models/Plant.php](app/Models/Plant.php), [app/Models/Product.php](app/Models/Product.php), [app/Models/Subscription.php](app/Models/Subscription.php), [app/Models/WebhookLog.php](app/Models/WebhookLog.php)
- Views: [resources/views](resources/views)
- Stripe config: [config/stripe.php](config/stripe.php)

## 2) Feature Inventory (What Exists Today)

### Public/Marketing

- Landing page with hero, features, how-it-works, and CTAs.
    - View: [resources/views/welcome.blade.php](resources/views/welcome.blade.php)

### Authentication & Account

- Register, login, logout.
    - Views: [resources/views/auth/register.blade.php](resources/views/auth/register.blade.php), [resources/views/auth/login.blade.php](resources/views/auth/login.blade.php)
    - Routes: [routes/auth.php](routes/auth.php)
- Password reset flow.
    - Views: [resources/views/auth/forgot-password.blade.php](resources/views/auth/forgot-password.blade.php), [resources/views/auth/reset-password.blade.php](resources/views/auth/reset-password.blade.php)
    - Routes: [routes/auth.php](routes/auth.php)
- Email verification routes & UI are present (verification prompt, resend). The `User` model does not explicitly implement `MustVerifyEmail`.
    - View: [resources/views/auth/verify-email.blade.php](resources/views/auth/verify-email.blade.php)
    - Routes: [routes/auth.php](routes/auth.php)
- Confirm password flow for sensitive actions.
    - View: [resources/views/auth/confirm-password.blade.php](resources/views/auth/confirm-password.blade.php)
    - Routes: [routes/auth.php](routes/auth.php)

### Profile Management

- Update profile (name, email).
- Update password.
- Delete account.
    - Views: [resources/views/profile/edit.blade.php](resources/views/profile/edit.blade.php) and partials in [resources/views/profile/partials](resources/views/profile/partials)
    - Controller: [app/Http/Controllers/ProfileController.php](app/Http/Controllers/ProfileController.php)

### Calculator (Subscription-Gated)

- Calculator entry page (select plants, quantities).
- Cost calculation and results breakdown.
- Recalculate totals based on selected products.
- Save calculation to dashboard.
- View a saved calculation.
- Delete a saved calculation.
    - Controller: [app/Http/Controllers/CalculatorController.php](app/Http/Controllers/CalculatorController.php)
    - Views: [resources/views/calculator/index.blade.php](resources/views/calculator/index.blade.php), [resources/views/calculator/result.blade.php](resources/views/calculator/result.blade.php)

### Dashboard (Subscription-Gated)

- Stats: total calculations, favorite plants (static 0), estimated savings.
- Recent calculations list with view/delete actions.
- Link to profile editing.
- Link to admin-only webhook logs for admin email.
    - View: [resources/views/dashboard.blade.php](resources/views/dashboard.blade.php)
    - Route: [routes/web.php](routes/web.php)

### Subscriptions (Stripe)

- Subscription plans list (single “premium” plan).
- Stripe Checkout for subscription.
- Success/cancel routes.
- Stripe webhook endpoint to sync subscription status.
- Admin webhook log viewer.
    - Controller: [app/Http/Controllers/SubscriptionController.php](app/Http/Controllers/SubscriptionController.php)
    - Webhook logs controller: [app/Http/Controllers/WebhookLogController.php](app/Http/Controllers/WebhookLogController.php)
    - Views: [resources/views/subscription/index.blade.php](resources/views/subscription/index.blade.php), [resources/views/layouts/webhook-logs.blade.php](resources/views/layouts/webhook-logs.blade.php)
    - Stripe config: [config/stripe.php](config/stripe.php)

## 3) User Flows & Critical Paths

### Guest to Subscriber to Calculator

1. Guest opens landing page.
2. Guest registers or logs in.
3. Authenticated user navigates to subscription page.
4. User completes Stripe Checkout.
5. Success callback creates subscription record.
6. User accesses calculator, runs calculation, saves result.
7. User views results and dashboard history.

### Auth & Account Management

- Register → (optional) verify email → login.
- Forgot password → email reset link → reset password.
- Profile update (name/email) and password update.
- Account deletion with password confirmation.

### Admin Webhook Logs

- Admin user (email match) accesses webhook logs page.
- Sees Stripe webhook payloads and status logs.

## 4) Database Schema & Models

### Core Domain Tables

- `users`
    - Fields: id, name, email, email_verified_at, password, remember_token, stripe_id, timestamps.
    - Migration: [database/migrations/0001_01_01_000000_create_users_table.php](database/migrations/0001_01_01_000000_create_users_table.php) and [database/migrations/2025_04_08_213736_add_stripe_id_to_users_table.php](database/migrations/2025_04_08_213736_add_stripe_id_to_users_table.php)
- `plants`
    - Fields: name, scientific_name, description, image_url, pot_size_required, soil_amount_required, seeds_per_plant, price, timestamps.
    - Migration: [database/migrations/2025_04_01_200913_create_plants_table.php](database/migrations/2025_04_01_200913_create_plants_table.php)
- `products`
    - Fields: name, type, description, image_url, price, store_name, store_url, size, timestamps.
    - Migration: [database/migrations/2025_04_01_201005_create_products_table.php](database/migrations/2025_04_01_201005_create_products_table.php)
- `calculations`
    - Fields: user_id, plants_data (json), products_data (json), total_cost, plants_count, estimated_savings, is_public, timestamps.
    - Migration: [database/migrations/2025_04_08_182615_create_calculations_table.php](database/migrations/2025_04_08_182615_create_calculations_table.php)
- `subscriptions`
    - Fields: user_id, stripe_id, stripe_status, stripe_price, quantity, trial_ends_at, ends_at, timestamps.
    - Migration: [database/migrations/2025_04_08_213704_create_subscriptions_table.php](database/migrations/2025_04_08_213704_create_subscriptions_table.php)
- `webhook_logs`
    - Fields: event_id, event_type, payload, status, error_message, timestamps.
    - Migration: [database/migrations/2025_04_08_214354_create_webhook_logs_table.php](database/migrations/2025_04_08_214354_create_webhook_logs_table.php)

### Platform/Framework Tables

- `password_reset_tokens`, `sessions`.
    - Migration: [database/migrations/0001_01_01_000000_create_users_table.php](database/migrations/0001_01_01_000000_create_users_table.php)
- `cache`, `cache_locks`.
    - Migration: [database/migrations/0001_01_01_000001_create_cache_table.php](database/migrations/0001_01_01_000001_create_cache_table.php)
- `jobs`, `job_batches`, `failed_jobs`.
    - Migration: [database/migrations/0001_01_01_000002_create_jobs_table.php](database/migrations/0001_01_01_000002_create_jobs_table.php)

### Model Relationships

- `User` → `subscription()` (active), `subscriptions()` (history).
- `User` → `calculations()` (implicit via `Calculation::where('user_id')`).
- `Calculation` → `user()`.
- `Subscription` → `user()`.

## 5) API Endpoints & Web Routes

### Public

- GET / → landing page.

### Auth (guest)

- GET/POST /register
- GET/POST /login
- GET/POST /forgot-password
- GET /reset-password/{token}
- POST /reset-password

### Auth (authenticated)

- GET /verify-email
- GET /verify-email/{id}/{hash}
- POST /email/verification-notification
- GET/POST /confirm-password
- PUT /password
- POST /logout

### App (authenticated)

- GET /calculator → calculator page.
- GET /profile → profile page.
- PATCH /profile → update profile.
- DELETE /profile → delete account.
- /subscription/\* → plans, checkout, success, cancel.

### Subscription-Gated

- POST /calculator/calculate
- POST /calculator/recalculate
- POST /calculator/save
- GET /calculator/result/{id}
- DELETE /calculator/{id}
- GET /dashboard

### Webhooks / Admin

- POST /stripe/webhook
- GET /admin/webhook-logs (admin-only)

All routes defined in [routes/web.php](routes/web.php) and [routes/auth.php](routes/auth.php).

## 6) Authentication & Authorization Logic

- Primary auth guard: session-based web guard (Laravel default).
    - Config: [config/auth.php](config/auth.php)
- Subscription gating via `subscription` middleware, which checks `User::hasActiveSubscription()`.
    - Middleware: [app/Http/Middleware/SubscriptionMiddleware.php](app/Http/Middleware/SubscriptionMiddleware.php)
    - Model logic: [app/Models/User.php](app/Models/User.php)
- Admin check via `admin` middleware, hardcoded to email `admin@example.com`.
    - Middleware: [app/Http/Middleware/AdminMiddleware.php](app/Http/Middleware/AdminMiddleware.php)

## 7) Third-Party Integrations

- Stripe:
    - Checkout sessions for subscription.
    - Webhook processing for subscription status updates.
    - Config: [config/stripe.php](config/stripe.php), provider in [app/Providers/StripeServiceProvider.php](app/Providers/StripeServiceProvider.php)
- Google Fonts (Inter).
    - Referenced in views: [resources/views](resources/views)
- Fly.io deployment config.
    - [fly.toml](fly.toml)

## 8) Environment Configuration

Key env vars inferred from config:

- App: `APP_NAME`, `APP_ENV`, `APP_DEBUG`, `APP_URL`, `APP_KEY`, `APP_LOCALE`.
    - Config: [config/app.php](config/app.php)
- DB: `DB_CONNECTION`, `DB_DATABASE`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`.
    - Config: [config/database.php](config/database.php)
- Sessions: `SESSION_DRIVER`, `SESSION_LIFETIME`, `SESSION_COOKIE`, `SESSION_SECURE_COOKIE`.
    - Config: [config/session.php](config/session.php)
- Stripe: `STRIPE_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_STANDARD_PRICE_ID`.
    - Config: [config/stripe.php](config/stripe.php)
- Mail (for password resets, verification): `MAIL_*`.
    - Config: [config/mail.php](config/mail.php)
- Queue: `QUEUE_CONNECTION` (default `database`).
    - Config: [config/queue.php](config/queue.php)
- Logging: `LOG_CHANNEL`, `LOG_LEVEL`, `LOG_STDERR_FORMATTER`.
    - Config: [config/logging.php](config/logging.php)

Fly.io overrides/sets:

- `APP_ENV=production`, `LOG_CHANNEL=stderr`, `LOG_LEVEL=info`, `SESSION_DRIVER=cookie`, `SESSION_SECURE_COOKIE=true`.
    - [fly.toml](fly.toml)

## 9) Business Logic & Validation Rules

### Calculator

- Requires active subscription; otherwise redirects to subscription page with warning.
- Validation:
    - `plants` required array, min 1.
    - Each plant: `id` exists, `quantity` integer min 1.
- Logic:
    - Compute plant costs, add selected products, compute total cost.
    - Products initially all selected and stored in session.
    - Recalculate totals based on selected products.
    - Save calculation with JSON payloads of plants/products.
    - If updating saved calculation: `update_calculation=1` plus `calculation_id`.
    - Source: [app/Http/Controllers/CalculatorController.php](app/Http/Controllers/CalculatorController.php)

### Subscription

- Checkout validates plan id from config.
- On success, creates `Subscription` and sets `User.stripe_id`.
- Webhook updates subscription status, logs events.
    - Source: [app/Http/Controllers/SubscriptionController.php](app/Http/Controllers/SubscriptionController.php)

### Profile

- Profile update validation: `name` required, `email` required/unique.
    - Source: [app/Http/Requests/ProfileUpdateRequest.php](app/Http/Requests/ProfileUpdateRequest.php)

## 10) File Upload/Storage Mechanisms

- No user file uploads implemented.
- Static assets served from public folder (logo, hero images).
    - Example: [public/images](public/images)
- Plant/product images are stored as external URLs in seed data.
    - Seeders: [database/seeders/PlantSeeder.php](database/seeders/PlantSeeder.php), [database/seeders/ProductSeeder.php](database/seeders/ProductSeeder.php)
- Default storage disks configured for local/public/S3.
    - Config: [config/filesystems.php](config/filesystems.php)

## 11) Background Jobs & Scheduling

- Queue infrastructure configured (database queue tables). No custom jobs found.
- Dev script runs `php artisan queue:listen` but no jobs defined in code.
- No scheduled tasks configured.
    - Console routes: [routes/console.php](routes/console.php)

## 12) Notable Frontend Behavior

- Calculator forms are enhanced with inline JavaScript for adding/removing plants and recalculating totals.
    - Views: [resources/views/calculator/index.blade.php](resources/views/calculator/index.blade.php), [resources/views/calculator/result.blade.php](resources/views/calculator/result.blade.php)
- Mobile menu toggles in multiple pages via small inline scripts.

---

End of Phase 1 Discovery.
