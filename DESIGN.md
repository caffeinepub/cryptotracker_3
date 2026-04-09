# Design Brief

## Direction

Bloomberg Terminal × Delta — High-performance crypto dashboard UI with deep obsidian foundations, instrument-grade precision, and vibrant profit/loss indicators for instant data legibility.

## Tone

Brutal minimalism with calculated color tension — dark neutrals + electric hits for actionable states. Precision over decoration; every pixel earns its place.

## Differentiation

Glassmorphism headers with ultra-thin 1px borders + staggered price flash animations (electric emerald for gains, crimson pulse for losses) create haptic-style feedback without haptics.

## Color Palette

| Token        | OKLCH             | Role                                   |
| ------------ | ----------------- | -------------------------------------- |
| background   | 0.07 0.01 290     | Deep Obsidian — primary page background |
| foreground   | 0.95 0 0          | Crisp white — body text and labels     |
| card         | 0.12 0.01 280     | Slate elevation — content containers   |
| primary      | 0.65 0.16 150     | Electric Emerald — gains, CTAs         |
| accent       | 0.62 0.2 22       | Crimson Pulse — losses, warnings       |
| muted        | 0.35 0 0          | Secondary text, hints, disabled states |
| border       | 0.16 0.01 285     | Ultra-thin 1px dividers, glass edges   |

## Typography

- Display: DM Sans — headers, hero balance, bold accents
- Body: DM Sans — labels, data, transaction details
- Mono: Geist Mono — chart values, prices, holdings
- Scale: Hero 2.5rem/bold, h2 1.875rem/600, label 0.875rem/500, body 1rem/400

## Elevation & Depth

Minimal surface hierarchy via OKLCH lightness shift (0.07 bg → 0.12 card → 0.15 popover); ultra-thin 1px borders replace heavy shadows. Glassmorphism on sticky headers via backdrop-blur + semi-transparent overlay.

## Structural Zones

| Zone    | Background        | Border                 | Notes                                 |
| ------- | ----------------- | ---------------------- | ------------------------------------- |
| Header  | card + glass      | 1px border-border      | Sticky, glassmorphic, app title + nav |
| Content | background        | —                      | Main asset list and charts            |
| Cards   | card + 1px border | border-border          | Coin cards, stat tiles, drawers       |
| Footer  | card              | border-t border-border | Action bar or transaction history    |

## Spacing & Rhythm

16px base unit: sections 32px apart, card padding 16px, icon gaps 8px. Staggered list animations (50ms delay per item). Price updates flash 600ms. Modal entrance spring physics via motion library.

## Component Patterns

- Buttons: Emerald bg for gains/add, Crimson for losses/delete, minimal 1px border outline for secondary
- Cards: Rounded sm (0.375rem), bg-card, border 1px border-border, no shadow
- Badges: bg-muted text-muted-foreground, rounded full, 6px padding, mono font

## Motion

- Entrance: Staggered fade-in (50ms per list item) via motion.div; modals spring-in via MotionConfig spring physics
- Hover: Price cells brighten 12% lightness on hover, button text color shifts to primary
- Decorative: 24h balance % pulses soft (0.7 opacity at 50% cycle, 2s duration); price flashes green/red 600ms on update

## Constraints

- No gradients; color tension via OKLCH chroma + hue shifts only
- Borders always 1px max; no outlines, no double-borders
- Radius capped at sm (0.375rem) — no soft curves, maintains precision
- Mobile-first: touch targets ≥44px, single-column layout until md breakpoint

## Signature Detail

Ultra-thin 1px borders on glassmorphic headers that blur the background — a Bloomberg Terminal–inspired detail that signals "instrument-grade" precision without ornamentation.
