# Luxury aesthetic pass — all tabs (mentor untouched)

Goal: lift every surface outside the 3D mentor to feel premium — deeper blacks, jewel-tone state accents, gold micro-details, layered glass with real texture (grain, gradients, inset highlights, shadows). All colors as hex or rgb/rgba — no `oklch`.

## Out of scope (do NOT touch)
- `src/components/socratic/engine/Mentor3D.tsx`
- `src/components/socratic/engine/MentorCanvas.tsx`
- everything under `src/components/socratic/engine/mentor3d/**`
- `mentor.vrm`, motion FBX/GLB files, retarget logic

Mentor canvas keeps its current look; only its surrounding chrome changes.

## 1. New token system in `src/styles.css`

Replace the current flat dark palette with a layered "noir + jewel" system. All values in hex / rgba.

```text
Base (always-on)
--bg-abyss:        #07070C   (page background, deepest)
--bg-night:        #0E0E18   (app shell)
--bg-onyx:         #15151F   (card base)
--bg-onyx-raised:  #1B1B28   (raised card / popover)
--ink-primary:     #F5F1E6   (warm ivory text)
--ink-secondary:   rgba(245,241,230,0.62)
--ink-tertiary:    rgba(245,241,230,0.38)

Metals (luxury accents, state-independent)
--gold:            #C9A24B
--gold-soft:       #E6C97A
--gold-deep:       #8B6B2A
--platinum:        #D8DCE3
--copper:          #B87333

Borders & glass
--hairline:        rgba(245,241,230,0.07)   (default border)
--hairline-strong: rgba(245,241,230,0.14)   (hover/active border)
--glass-tint:      rgba(255,255,255,0.025)
--glass-tint-2:    rgba(255,255,255,0.05)
--inset-highlight: inset 0 1px 0 rgba(255,255,255,0.06)

Shadows (depth)
--shadow-soft:     0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)
--shadow-deep:     0 2px 4px rgba(0,0,0,0.5), 0 24px 60px -12px rgba(0,0,0,0.6)
--shadow-lift:     0 30px 80px -20px rgba(0,0,0,0.7)

Gradients (reusable)
--grad-onyx:       linear-gradient(180deg, #1B1B28 0%, #13131C 100%)
--grad-aurora:     linear-gradient(135deg, rgba(201,162,75,0.10), rgba(56,189,248,0.08) 50%, rgba(139,92,246,0.10))
--grad-vignette:   radial-gradient(ellipse at top, rgba(201,162,75,0.08), transparent 60%)
```

### State accents (richer, jewel-toned)
Each state gets accent / glow / ambient triplet + a metallic companion.

```text
IDLE       --state-accent #D4A84B   --state-glow rgba(212,168,75,0.40)   ambient #11111A → #14131F → #08080E
FOCUS      --state-accent #5BC0EB   --state-glow rgba(91,192,235,0.45)   ambient #0B1622 → #122236 → #07101A   companion: sapphire #2A6FB5
CHALLENGE  --state-accent #E37B3C   --state-glow rgba(227,123,60,0.50)   ambient #1A0E08 → #251510 → #0D0A0E   companion: ember #C0392B
CELEBRATE  --state-accent #9BD66C   --state-glow rgba(155,214,108,0.50)  ambient #14200E → #1E2C12 → #0E1408   companion: gold #E6C97A
```

## 2. Reusable surface classes (added in `styles.css`)

- `.surface-luxe` — onyx gradient + `--inset-highlight` + `--shadow-deep` + 1px hairline border + subtle noise (SVG data-URI grain) at 4% opacity.
- `.surface-luxe-elevated` — same + `--shadow-lift` + brighter top edge.
- `.hairline-gold` — 1px border with `linear-gradient(90deg, transparent, var(--gold) 50%, transparent)` mask for a thin gold divider.
- `.text-gold` — `--gold` with subtle text-shadow `0 0 18px rgba(201,162,75,0.25)`.
- `.glow-state` — utility for state-driven box glow.
- `@keyframes shimmer-gold` — slow pan over gold gradient (used on hero CTA + accent badges).
- Global noise overlay (`body::after`) at 3% opacity for filmic texture.

## 3. Per-tab refinements

Each route gets the same kit applied: deeper base, layered glass, gold hairlines, jewel-tone accent driven by state.

| File | Changes |
|---|---|
| `src/routes/__root.tsx` | Body background = `--bg-abyss` + `--grad-vignette` overlay + global noise. |
| `src/components/socratic/Sidebar.tsx` | Replace `bg-[oklch(...)]` with `--bg-night` gradient; gold-hairline right border; active item gets gold left bar + soft state-glow; logo "ira" in gold. |
| `src/components/socratic/TopBar.tsx` | Onyx gradient bg, gold hairline bottom border, mentor-status chip becomes pill with gold ring + state dot. |
| `src/routes/index.tsx` (Your Path) | Hero → `surface-luxe-elevated` with aurora gradient + shimmer-gold band under heading; CTA button = gold gradient (`#E6C97A → #C9A24B → #8B6B2A`) with deep shadow + hover lift; stat cards → `surface-luxe` with gold icon ring; progress bars use state-accent → gold gradient. |
| `src/routes/skill-passport.tsx` | Cards → `surface-luxe`; badges get gold foil border; section headers use gold eyebrow + ivory title. |
| `src/routes/architecture-log.tsx` | Timeline rail = gold hairline; entries on onyx cards with state-tinted left edge. |
| `src/routes/lesson-builder.tsx` | Form panels → `surface-luxe`; inputs → `--bg-onyx-raised` with `--hairline-strong` focus → gold ring. |
| `src/routes/settings.tsx` | Same surface kit; toggles get gold-on track when active. |
| `src/components/socratic/engine/SocraticEngine.tsx` (layout only, not mentor canvas) | Outer panels, stepper, terminal frame upgraded; **MentorCanvas stays as-is**. |
| `src/components/socratic/engine/InteractiveDebateTerminal.tsx` | Terminal frame: onyx gradient, gold hairline top, intent selector buttons get gold-active state, mic button gets state-glow ring. |
| `src/components/socratic/engine/StepperBar.tsx` | Steps: completed = gold gradient pill, active = state-accent with glow, pending = hairline. |
| `src/components/socratic/engine/CelebrationOverlay.tsx` | Confetti tint → gold + celebrate-green; backdrop = radial gold vignette. |
| `src/components/socratic/AmbientBackground.tsx` | Add second layer: slow-drifting radial gold orb (8% opacity) + film grain. |

## 4. Texture details (the "4K / luxury" feel)

- Inset highlight (`inset 0 1px 0 rgba(255,255,255,0.06)`) on every raised surface so edges catch light.
- Outer shadow uses two layers (sharp contact + soft ambient).
- Borders are never pure white — always warm ivory at low alpha.
- Backgrounds are always gradients, never flat fills (onyx top → deeper bottom).
- Body-level SVG noise (3–4% opacity, `feTurbulence`) kills banding in dark gradients.
- Gold accents reserved for: brand mark, primary CTA, active nav, dividers, key numerals — never bulk text.

## 5. Verification

After build:
1. Visit `/`, `/engine`, `/skill-passport`, `/lesson-builder`, `/architecture-log`, `/settings` — every surface shows layered depth, gold hairlines, and state-driven accent shifts on the FOCUS/CHALLENGE/CELEBRATE buttons.
2. Confirm mentor canvas on `/engine` is visually unchanged (only its surrounding chrome differs).
3. Grep confirms no new `oklch(` in changed files; all colors are hex or rgb/rgba.
