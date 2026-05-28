# Fix invisible text in light mode

## Root cause

Many components hardcode dark-theme ink as inline styles:
- `color: "#F5F1E6"` (cream)
- `color: "rgba(245,241,230,0.62 / 0.55 / 0.45 / 0.40 / 0.35)"`
- one hardcoded `background: "#F5F1E6"` swatch in settings

These never switch when `html[data-theme="light"]` flips `--ink-primary` to `#1F1B16`, so on white surfaces the text renders cream-on-cream and is essentially invisible.

## Fix

Swap every hardcoded cream value for the existing theme tokens that already adapt across light/dark:

| Hardcoded | Replace with |
|---|---|
| `#F5F1E6` (text) | `var(--ink-primary)` |
| `rgba(245,241,230,0.62)` | `var(--ink-secondary)` |
| `rgba(245,241,230,0.55 / 0.50 / 0.45 / 0.40 / 0.35)` | `var(--ink-tertiary)` (the few intermediate shades collapse cleanly to secondary/tertiary) |
| `#F5F1E6` (swatch background in `settings.tsx`) | `var(--ink-primary)` |
| `rgba(230,201,122,0.85)` gold-on-dark chips | `var(--gold-soft)` (already token-aware) |

Tokens stay as-is; they already have correct light-mode values (`--ink-primary: #1F1B16`, `--ink-secondary: rgba(31,27,22,0.62)`, `--ink-tertiary: rgba(31,27,22,0.42)`).

## Files to edit

Frontend-only, no logic changes, no mentor files:

- `src/routes/index.tsx`
- `src/routes/skill-passport.tsx`
- `src/routes/architecture-log.tsx`
- `src/routes/settings.tsx`
- `src/components/socratic/Sidebar.tsx`
- `src/components/socratic/TopBar.tsx` (audit only — already mostly tokenized)

## Out of scope

- No changes to mentor (`Mentor3D.tsx`, `MentorCanvas.tsx`, `mentor3d/**`, `MentorGlassFrame.tsx` mentor internals).
- No changes to `styles.css` tokens — they're already correct.
- No changes to the engine terminal intent colors (`#E37B3C / #E6C97A / #5BC0EB`) — those are intent semantics, readable in both themes.

## Verification

After edits: load `/`, `/skill-passport`, `/architecture-log`, `/settings` in light mode via the TopBar toggle and confirm headings, body copy, and sidebar labels are all legible on the clay-white surfaces.
