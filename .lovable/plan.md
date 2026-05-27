
# Mentor glass shell + State Indicator + Clay light mode

Three intertwined upgrades, all outside the mentor 3D internals. Mentor canvas, model, and motion files stay untouched — we only enhance the **frame around** it and the global theme.

## Out of scope (untouched)
- `Mentor3D.tsx`, `MentorCanvas.tsx` internals, everything under `mentor3d/**`
- `mentor.vrm`, FBX motions, retarget logic

We will wrap `MentorCanvas` from the outside (in `SocraticEngine.tsx`) and tweak `styles.css` — the canvas itself stays as-is.

---

## 1. Luxury glass shell around the mentor

New component `src/components/socratic/engine/MentorGlassFrame.tsx` that wraps `<MentorCanvas />` without modifying it.

Structure:
```text
┌─ MentorGlassFrame ──────────────────────────────┐
│  [State Indicator Tag]          [lumira · live] │  ← header rail (gold hairline)
│                                                 │
│   ╭──────────────────────────────────────╮     │
│   │                                      │     │
│   │         <MentorCanvas /> (unchanged) │     │  ← inner well, recessed
│   │                                      │     │
│   ╰──────────────────────────────────────╯     │
│                                                 │
│   ◦ ambient state ring · breathing glow         │  ← footer (subtle)
└─────────────────────────────────────────────────┘
```

Visual treatment:
- Outer card: `.surface-luxe-elevated` + double border (1px gold hairline outside, 1px ivory hairline inside) → "frame within a frame" jewelry-box feel.
- Inner well holding the canvas: inset shadow (`inset 0 2px 12px rgba(0,0,0,0.55)`), rounded `1.25rem`, slight backdrop blur on the rim so the 3D scene appears set into the glass.
- Animated breathing glow around the frame driven by `--state-glow` (pulse 4s).
- Corner accents: 4 tiny gold L-brackets at each corner (12px) — pure CSS, "luxury watch case" detail.
- Light grain overlay reusing the existing SVG noise.

## 2. State Indicator Tag (visible, always-on)

New `src/components/socratic/engine/StateIndicatorTag.tsx`, mounted in the glass shell header.

Reads `useLearningState()` and renders a pill:
- Left: pulsing dot in `--state-accent` with `--state-glow` halo.
- Middle: state label in uppercase mono (`IDLE · WALKING WITH YOU`, `FOCUS · LISTENING`, `CHALLENGE · BELIEVING IN YOU`, `CELEBRATE · PROUD OF YOU`).
- Right: thin gold divider + intent micro-label (when speaking: "speaking…", when paused: "thinking…").
- Pill style: `bg-onyx-raised` with gold ring, inset highlight, soft `--state-glow` outer shadow that intensifies on state change (300ms transition).
- Tag swaps tint smoothly because it uses CSS vars already driven by `data-state` on `<html>`.

Reuses existing `LearningState` from `src/components/socratic/types.ts` — no logic changes.

## 3. Visual richness pass (non-mentor surfaces)

Small, targeted additions on top of the existing luxe system:
- **Dashboard hero (`src/routes/index.tsx`)**: add a soft floating gold orb + parallax aurora gradient behind the headline.
- **Sidebar**: active nav item gets a hairline gold left bar + state-glow halo.
- **Engine layout (`SocraticEngine.tsx`)**: the new `MentorGlassFrame` replaces the bare `<MentorCanvas />` placement; stepper and terminal get matching corner brackets so the engine reads as one jewelry set.
- **Buttons across tabs**: ensure primary CTAs use `.btn-gold`, state actions use `.btn-state` (audit + fix any stragglers).

No new dependencies. All hex/rgba.

## 4. Clay-shader light mode

Add a true light theme keyed off `<html data-theme="light">` with a "bubbly Minecraft-clay-with-shaders" feel: matte off-whites, soft pastel greys, rounded soft shadows, gentle ambient occlusion vibe — not flat, not harsh.

### Palette (hex)
```text
Surfaces (clay)
--bg-abyss      #F4F1EC   (page — warm bone)
--bg-night      #EDE8E0   (shell — soft clay)
--bg-onyx       #FFFFFF   (card — fresh clay)
--bg-onyx-raised#FBF8F2   (raised — cream highlight)

Ink
--ink-primary   #1F1B16   (grayish-black, warm)
--ink-secondary rgba(31,27,22,0.62)
--ink-tertiary  rgba(31,27,22,0.42)

Hairlines (the "shader edge" — slight darker rim like clay bevel)
--hairline       rgba(31,27,22,0.10)
--hairline-strong rgba(31,27,22,0.18)
--inset-highlight inset 0 1px 0 rgba(255,255,255,0.95)   /* top light */
--inset-lowlight  inset 0 -1px 0 rgba(31,27,22,0.06)     /* bottom AO */

Shadows (puffy / bubbly — multiple soft layers, not sharp)
--shadow-soft  0 1px 2px rgba(31,27,22,0.06), 0 8px 24px rgba(31,27,22,0.08)
--shadow-deep  0 2px 6px rgba(31,27,22,0.08), 0 24px 60px -16px rgba(31,27,22,0.18)
--shadow-lift  0 30px 80px -28px rgba(31,27,22,0.22)

Metals (kept, slightly warmer to sit on cream)
--gold        #B8862F
--gold-soft   #D9B25E
--gold-deep   #7A5618

Gradients (clay glaze)
--grad-onyx         linear-gradient(180deg, #FFFFFF 0%, #F6F1E8 100%)
--grad-onyx-raised  linear-gradient(180deg, #FFFFFF 0%, #FBF6EC 100%)
--grad-vignette     radial-gradient(ellipse at top, rgba(184,134,47,0.08), transparent 60%)
```

### State accents (light-mode versions — softer, candy-shaded)
```text
IDLE      accent #C99A3A  glow rgba(201,154,58,0.22)
FOCUS     accent #2E8FB8  glow rgba(46,143,184,0.24)
CHALLENGE accent #C75A28  glow rgba(199,90,40,0.26)
CELEBRATE accent #4FA64A  glow rgba(79,166,74,0.26)
```

### "Clay shader" feel
The bubbly Minecraft-shader look = matte surface + top highlight + bottom ambient occlusion + soft outer shadow + slightly rounder corners. We get that via:
- Every `.surface-luxe*` adds both `--inset-highlight` and `--inset-lowlight` in light mode.
- Border-radius bumped from `1rem` → `1.25rem` and `1.25rem` → `1.5rem` in light mode (pill/clay feel).
- Buttons get a gentle pressed-in shadow on `:active` (mimics squishy clay).
- Grain overlay opacity reduced to `0.025` (just enough to kill banding without dirtying the cream).
- Body background uses `--grad-vignette` + a slow drifting cream orb (analog of the dark gold orb).

### Theme switching
- Add `ThemeProvider` in `src/lib/theme-context.tsx` (localStorage-persisted, default `dark`, respects `prefers-color-scheme`).
- Sets `data-theme` on `<html>`; existing `data-state` continues to drive state accents.
- Add toggle in `TopBar.tsx` (sun/moon icon, gold ring, animated swap).
- `styles.css` adds `html[data-theme="light"] { ... }` block overriding the tokens above; all existing component classes inherit automatically because they use CSS vars.

---

## Files

**New**
- `src/components/socratic/engine/MentorGlassFrame.tsx`
- `src/components/socratic/engine/StateIndicatorTag.tsx`
- `src/lib/theme-context.tsx`

**Edited**
- `src/styles.css` — add `html[data-theme="light"]` token block, `--inset-lowlight`, light-mode `.surface-luxe*` rules, softer shadows on `:active` for buttons.
- `src/components/socratic/engine/SocraticEngine.tsx` — wrap `<MentorCanvas />` in `<MentorGlassFrame>`.
- `src/components/socratic/TopBar.tsx` — theme toggle button.
- `src/routes/__root.tsx` — mount `ThemeProvider`.
- `src/routes/index.tsx` — floating orb + aurora behind hero.
- `src/components/socratic/Sidebar.tsx` — gold bar + state halo on active item.

**Untouched (per your rule)**
- `Mentor3D.tsx`, `MentorCanvas.tsx`, `mentor3d/**`, `mentor.vrm`, FBX/GLB motion files.

## Verification
1. `/engine`: mentor canvas now sits inside a luxe glass case with corner brackets and a visible State Indicator Tag that recolors as state changes (FOCUS → sapphire, CHALLENGE → ember, CELEBRATE → emerald).
2. Mentor 3D scene itself is pixel-identical to before.
3. Theme toggle in top bar flips entire app to clay light mode — surfaces feel matte/bubbly, gold accents warmer, state tags soften but stay legible.
4. Grep confirms no `oklch(` introduced; all new colors hex/rgba.
