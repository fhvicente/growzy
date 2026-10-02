# Growzy Design System

Lane: "Field Notes". Pacote de sementes impresso a duas cores: verde-musgo que enche secções inteiras, papel cru, um acento tomate. Referências: embalagens CPG de mercearia artesanal, templates de comida/CPG no Framer, SOTDs Awwwards com tipografia display grande.

Cena: alguém numa varanda em Lisboa num sábado de manhã, telemóvel na mão, a decidir que vasos comprar. Luz forte, por isso tema claro em papel, com blocos de musgo para contraste.

## Color (OKLCH, strategy: Committed)

| Token | Value | Role |
|---|---|---|
| `--color-paper` | oklch(96.5% 0.018 95) | fundo base |
| `--color-paper-2` | oklch(92.5% 0.028 95) | superfícies, faixas |
| `--color-ink` | oklch(22% 0.035 150) | texto |
| `--color-ink-soft` | oklch(42% 0.03 150) | texto secundário |
| `--color-moss` | oklch(34% 0.075 150) | cor de marca, drench (30-60% da landing) |
| `--color-moss-deep` | oklch(26% 0.06 150) | moss pressed / footer |
| `--color-sprout` | oklch(86% 0.16 125) | texto/realces sobre moss |
| `--color-tomato` | oklch(66% 0.19 38) | CTA principal, um por ecrã |
| `--color-line` | oklch(84% 0.03 100) | divisórias |

## Typography

- Display: **Bricolage Grotesque** (opsz 96, 700-800, tracking -0.04em). Headlines enormes, `clamp()`.
- Body/UI: **Figtree** (400-600), números com `tabular-nums`.
- Escala: 0.8125 / 1 / 1.25 / 1.6 / 2.4 / clamp(3rem, 9vw, 9.5rem).

## Shape & Components

- Botões pill (`rounded-full`), 44px mínimo, primário tomato sobre qualquer fundo, secundário ink outline.
- Superfícies: `paper-2` com borda `line`, raio 1.25rem. Sem sombras difusas; sombra dura 4px ink apenas no "talão".
- "Talão" (receipt): componente assinatura que mostra um cálculo, borda serrilhada, números em tabular.
- Sem cards de ícone em grelha. Listas numeradas grandes, linhas divisórias, fotografia.

## Motion (GSAP + ScrollTrigger + SplitText)

- Entrada do hero: headline por linhas (mask + yPercent), talão sobe e conta os valores.
- Scroll: caule SVG cresce (stroke-dashoffset scrub) ao longo dos passos; fotos com parallax leve.
- Easing `expo.out` / `power4.out`, 0.6-1.1s em entradas; UI da app 150-250ms.
- `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` envolve tudo.
