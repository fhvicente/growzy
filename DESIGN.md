# Growzy Design System

Lane: "Field Notes". A seed packet printed in two colours: moss green filling whole sections, raw paper, one tomato accent. References: artisan grocery CPG packaging, food/CPG templates on Framer, Awwwards SOTDs with large display typography.

Scene: someone on a balcony in Lisbon on a Saturday morning, phone in hand, deciding which pots to buy. Strong light, hence a light paper theme, with moss blocks for contrast.

## Color (OKLCH, strategy: Committed)

| Token | Value | Role |
|---|---|---|
| `--color-paper` | oklch(96.5% 0.018 95) | base background |
| `--color-paper-2` | oklch(92.5% 0.028 95) | surfaces, bands |
| `--color-ink` | oklch(22% 0.035 150) | text |
| `--color-ink-soft` | oklch(42% 0.03 150) | secondary text |
| `--color-moss` | oklch(34% 0.075 150) | brand colour, drench (30-60% of the landing) |
| `--color-moss-deep` | oklch(26% 0.06 150) | moss pressed / footer |
| `--color-sprout` | oklch(86% 0.16 125) | text/highlights on moss |
| `--color-tomato` | oklch(66% 0.19 38) | primary CTA, one per screen |
| `--color-line` | oklch(84% 0.03 100) | dividers |

## Typography

- Display: **Bricolage Grotesque** (opsz 96, 700-800, tracking -0.04em). Huge headlines, `clamp()`.
- Body/UI: **Figtree** (400-600), numbers with `tabular-nums`.
- Scale: 0.8125 / 1 / 1.25 / 1.6 / 2.4 / clamp(3rem, 9vw, 9.5rem).

## Shape & Components

- Pill buttons (`rounded-full`), 44px minimum, primary tomato on any background, secondary ink outline.
- Surfaces: `paper-2` with `line` border, 1.25rem radius. No diffuse shadows; hard 4px ink shadow only on the "talão" (receipt).
- "Talão" (receipt): signature component that shows a calculation, serrated edge, tabular numbers.
- No icon cards in a grid. Large numbered lists, divider lines, photography.

## Motion (GSAP + ScrollTrigger + SplitText)

- Hero entrance: headline by lines (mask + yPercent), receipt slides up and counts up the values.
- Scroll: SVG stem grows (stroke-dashoffset scrub) along the steps; photos with light parallax.
- Easing `expo.out` / `power4.out`, 0.6-1.1s on entrances; app UI 150-250ms.
- `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` wraps everything.
