# Build: Cinematic Editorial Grain

Lift the chosen v3 direction into the real app. Locked: Onyx & Platinum palette, DM Serif Display + Fira Sans + JetBrains Mono accents, bento layout. Scope: shell (sidebar, topbar, ambient bg) + dashboard route. Other routes inherit tokens automatically.

## Design tokens (copied from prototype, mapped to Onyx & Platinum)

Update `src/styles.css` (dark theme block):

```
--bg-abyss: #050505
--bg-night: #0A0A0F
--bg-onyx: #0C0C12
--bg-onyx-raised: #14141A

--ink-primary: #F5F5F7
--ink-secondary: rgba(245,245,247,0.55)
--ink-tertiary: rgba(245,245,247,0.32)

--platinum: #D8DCE3
--platinum-soft: #8A8F99
--hairline: rgba(255,255,255,0.05)
--hairline-strong: rgba(255,255,255,0.10)

/* keep --gold/--gold-soft as restrained spotlight only */
```

Light mode: keep clay tokens already in place; verify contrast.

## Typography wire-up

Add to `__root.tsx` link rel:
- `Cormorant Garamond` (italic + 500) — display serif for hero headline + bento numerals
- `Outfit` (300/400/600) — body/UI sans
- keep `JetBrains Mono` for catalog labels

Add to `@theme inline` in `styles.css`:
```
--font-display: "Cormorant Garamond", ui-serif, Georgia, serif;
--font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```
Add utility `.font-display` for the serif hero.

## Components to edit

### `src/components/socratic/Sidebar.tsx`
- Wider rail (`w-72`), 8-unit padding, gap-12 sections.
- Header: mono eyebrow `LUMIRA // AMBIENT OS`, wordmark `Lumi<span>ra</span>` (gold accent on "ra"), italic tagline.
- Nav items: numbered catalog markers `01`–`05` in a 20px ring, label on right. Active = `bg-gold/5 + border-gold/20 + white text`. Inactive = `zinc-tertiary` with hover ring + white text.
- Settings sits below with `mt-8` gap, marker `S`.
- Mentor State card: `surface-luxe`-style raised tile with grain overlay, mono micro-label, pulsing dot using `--state-accent`, uppercase IDLE/FOCUS/etc.

### `src/components/socratic/TopBar.tsx`
- 80px height, 40px horizontal padding, bottom hairline.
- Left: mono gold eyebrow `LUMIRA`, route title in white medium.
- Right: pill `mentor: <state-accent>walking with you</>` in mono on onyx pill, then circular 40px theme toggle with hairline border.

### `src/components/socratic/AmbientBackground.tsx`
- Replace current gold orb with: (1) very faint radial spotlight top-right tinted with `--state-glow`, (2) full-viewport SVG grain at 4% opacity, (3) hairline vertical guide lines at 25% / 75% on viewports ≥ lg.

### `src/routes/index.tsx` (Your Path)
- Hero card: `rounded-[2.5rem]`, `bg-bg-onyx`, hairline border, padding `p-16`, internal radial spotlight + grain overlay.
- Eyebrow chip `WELCOME BACK` in mono on `bg-white/5` rounded-md.
- Headline: `font-display italic` for "I've been waiting for you.", then `not-italic opacity-80` for the bridge phrase, then `Outfit semibold not-italic` for the resumed-topic span with gold underline.
- Body: Outfit light, `--ink-secondary`, max-w-2xl.
- CTAs: primary `btn-gold` reshape — `rounded-2xl`, `px-8 py-4`, black text, `shadow-[0_0_40px_rgba(201,162,75,0.18)]`, arrow icon; secondary outline `border-white/10`, rounded-2xl.
- Bento: 3-col grid, each tile `rounded-[2rem]`, `bg-bg-onyx-raised/30`, hairline border, icon in 48px rounded-2xl onyx well, mono micro-label, `font-display text-5xl` numeral with sub-label, hover gold underline gradient at bottom.

### `src/components/socratic/engine/MentorGlassFrame.tsx`
- Adopt the same vocabulary: hairline border, grain overlay, mono `MENTOR // STATE` eyebrow, numeral marker corners. Keep existing API (children).

### `src/components/socratic/engine/StateIndicatorTag.tsx`
- Pill restyle: onyx bg, hairline border, mono uppercase state label, state-accent dot. No layout changes.

## Out of scope (this iteration)

- Mentor 3D internals (`Mentor3D.tsx`, `MentorCanvas.tsx`, `mentor3d/**`, `.vrm`, motion files) — UNTOUCHED.
- Server/data logic.
- `architecture-log`, `skill-passport`, `settings` routes inherit token + font changes automatically; we won't recompose them in this pass.

## Verification

After edits: screenshot `/` in both themes, confirm hero serif/sans mix renders, bento tiles align, sidebar numerals render, no hardcoded cream text reintroduced, contrast passes in light mode.
