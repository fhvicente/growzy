# Growzy: what still needs improving and fixing

Updated on 2026-10-02.

## Summary

The Growzy landing page and identity are done. 4 functional bugs still need fixing and the inner pages need a redesign; so far they have only received the new colours and components. Suggested order: fix the bugs, align the copy and the plans, and only then redesign the calculator and the dashboard.

Already done: colour and typography tokens, logo, buttons, inputs, header, footer and the full landing page with GSAP. The inner pages already have the new brand, but the layout is still the old one.

## Urgent fixes

These bugs affect users or the deploy today.

| Problem | Where | Fix |
| --- | --- | --- |
| The "Terminar sessão" (Sign out) button does nothing (desktop and mobile) | `src/components/header.tsx` | Wire the `onClick` to `authClient.signOut()` and redirect to the landing page |
| The link to the result has no locale: `/calculator/result/:id` returns 404 | `src/app/[locale]/(protected)/dashboard/page.tsx:167` | Use `/${locale}/calculator/result/${calc.id}` |
| Link to `/contact`, a page that does not exist | `src/app/[locale]/pricing/page.tsx:257` | Remove the link or replace it with a real `mailto:` |
| The avatar always shows the letter "U" | `src/components/header.tsx:82` | Use the initial of `session.user.name` |
| `npm install` in Docker can fail due to a peer deps conflict (drizzle-orm / react-native) | `Dockerfile` | `RUN npm install --legacy-peer-deps`, or copy an `.npmrc` into the image |
| 3 type errors: the Stripe API version `2026-01-28.clover` is no longer the expected one | `src/app/api/stripe/webhook`, `subscription/checkout`, `subscription/success` | Update `apiVersion` to `2026-02-25.clover` or pin the `stripe` package version |
| The README says to copy a `.env.example` that does not exist | `README.md` | Create `.env.example` with `DATABASE_URL`, the Stripe keys and the Better Auth ones |

## Copy and consistency

The landing page addresses the user as "tu" (informal), but the inner pages use "você" (formal) ("Aceda à sua conta", "Planeie a sua horta"). Also, the plans promise features that only exist as flags.

- [ ] Switch to "tu" in login, sign-up, forgot and reset password, verify email, calculator, dashboard, pricing and `plan-display.tsx`
- [ ] Decide what to do with the promised but unimplemented features: planting calendar, savings comparison, report export, AI planning, harvest forecasts and alerts. Today they are just flags in `src/lib/plans.ts`. The options are to implement them, mark them as "em breve" (coming soon) or remove them from the landing page and the plans page
- [ ] Unify the plans: the `/pricing` page and the landing page's pricing section have different lists. Generate both from `PLAN_FEATURES`
- [ ] Confirm whether the annual price (€39 and €79) exists in Stripe; if not, remove it
- [ ] Confirm whether plant prices are really reviewed regularly, as the FAQ says
- [ ] Review the "O mais escolhido" (Most popular) badge on the Standard plan: only keep it if there is data to back it up

## Inner pages redesign

The inner pages have the new colours but the old layout: white cards, icons in squares and hard-coded colours (`bg-white`, `text-white`, `green-*`, `red-*`) in 22 places. In order of impact:

| Page | What to change |
| --- | --- |
| Calculator (`calculator-client.tsx`) | Reuse the landing page's "talão" (receipt) as a sticky summary on the side; quantities with − / + buttons; large total with animated count; plant search instead of a `select` |
| Result (`calculator/result/[id]`) | Full receipt, ready to take to the garden centre, with the Recalcular (Recalculate) and Partilhar (Share) buttons |
| Dashboard | Monthly spending chart, as on the landing page; saved gardens in rows, not cards; empty state with a CTA to create the first garden |
| Login, sign-up and recovery | Split screen: form on paper and a moss-green panel with a photo and a sentence |
| Pricing (`/pricing`) | Reuse the landing page's pricing section instead of keeping a separate version |
| Profile and subscription (success, cancellation) | Align with the rest; the success page can have a short animated moment |
| Admin (`webhook-logs`) | Tokens only; it is an internal tool |

In the app, animations should last 150 to 250 ms and serve as feedback, with no choreographed entrances.

## Landing page improvements

The landing page works on desktop and mobile. What is missing is polish and original content.

- [ ] Replace the Unsplash photos with original photos of Portuguese balconies and real app screenshots
- [ ] Create the Open Graph image, the favicon and the app icon with the new symbol (the `favicon.ico` is still the old one)
- [ ] Design the final logo; the current symbol (a seed with two leaves) is temporary
- [ ] Review the empty space at the top of the hero on tall screens (the content is bottom-aligned)
- [ ] On mobile, the hero receipt sits on top of the photo; check how it looks at 360 px
- [ ] Create a real social proof section once there are users (true numbers or testimonials with permission)
- [ ] Landing page header for signed-in users: today it uses the app's `Header`, without the transparent style over the hero

## Technical

- [ ] Images: move from `<img>` to `next/image` and configure `images.remotePatterns` (or serve the photos from `public/`). Biome warns about this in 3 places
- [ ] Biome: fix the `useImportType` warnings and the accessibility rules (`lint/a11y`) that already existed in `src/components/ui`
- [ ] Language: the `en` locale exists, but all text is in Portuguese and hard-coded. Decide whether English goes ahead (extract the strings) or `en` is removed
- [ ] `lang`: the `<html>` has a hard-coded `pt` and the locale layout puts `lang` on a `div`. Pass the locale to `<html>`
- [ ] SEO: per-page `metadata` (pricing, login), `sitemap.ts` and `robots.ts`
- [ ] Tailwind 4 no longer uses `tailwind.config.ts` (the theme is in `globals.css`). Delete it to avoid confusion
- [ ] Pick a single package manager: the project has `bun.lock` and `package-lock.json`
- [ ] `docs/landing-page-design-brief.md` describes the old design (Mini Horta); archive or update it
- [ ] The infrastructure still uses the old names: database `mini_horta` and containers `mini-horta-*`. Renaming requires migrating the data

## Accessibility and performance

Motion already respects `prefers-reduced-motion`, but measured audits are still missing.

- [ ] Measure the contrast of semi-transparent text on moss green (`text-paper/60`, `/50`) and of the orange buttons on the background; the target is WCAG AA
- [ ] Test keyboard-only navigation: mobile menu, FAQ and visible focus on the landing page links
- [ ] The mobile menu does not close with Esc nor trap focus
- [ ] Run Lighthouse on mobile: the hero photos are 1200 px and have no `srcset`, and GSAP (with ScrollTrigger and SplitText) is only needed on the landing page
