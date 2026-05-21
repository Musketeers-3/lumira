# The Socratic Engine — Build Plan (Multi-Page)

A premium, multi-page immersive learning app with a state-driven theme system, animated mentor avatar, and a hardcoded Socratic demo. Frontend-only; no backend, no auth, no AI calls. Shared sidebar + ambient background persist across all routes.

## Routes

| Path | File | Purpose |
|------|------|---------|
| `/` | `src/routes/index.tsx` | **Dashboard** — overview: current lesson card, recent breakthroughs, quick-resume CTA into the Engine |
| `/engine` | `src/routes/engine.tsx` | **The Socratic Engine** — split-view mentor canvas + debate terminal + 5-step Binary Search demo (the centerpiece) |
| `/skill-passport` | `src/routes/skill-passport.tsx` | **Skill Passport** — glass cards of unlocked concepts (Binary Search, Computational Thinking…), mastery meters, dates |
| `/architecture-log` | `src/routes/architecture-log.tsx` | **Architecture Log** — timeline of past Socratic sessions, intent breakdown per session, transcript previews |
| `/settings` | `src/routes/settings.tsx` | **Settings** — theme accent, mentor voice toggle, motion intensity, demo replay reset |

Shared layout (sidebar + ambient background + top header) lives in `src/routes/__root.tsx` so it persists across navigations. Each route file declares its own `head()` meta (title, description, og:title, og:description) — no shared metadata copy.

Active nav state via `<Link activeProps>` against `useRouterState`.

## File structure

```
src/routes/
  __root.tsx                         -> Sidebar + AmbientBackground + Outlet + per-route head
  index.tsx                          -> Dashboard
  engine.tsx                         -> Socratic Engine
  skill-passport.tsx                 -> Skill Passport
  architecture-log.tsx               -> Architecture Log
  settings.tsx                       -> Settings

src/components/socratic/
  AmbientBackground.tsx              -> radial gradients + drifting orb, state-tinted (global)
  Sidebar.tsx                        -> Dashboard / Engine / Skill Passport / Architecture Log / Settings
  TopBar.tsx                         -> route title + global state pill
  engine/
    SocraticEngine.tsx               -> owns learningState + demo step
    StepperBar.tsx                   -> 5-step demo controls + reset
    MentorCanvas.tsx                 -> glass canvas, state tag, avatar, waveform
    MentorAvatar.tsx                 -> SVG silhouette posture variants
    Waveform.tsx                     -> CSS-animated bars
    DebateTerminal.tsx               -> topic card + log feed + input dock
    TerminalMessage.tsx              -> terminal-styled message w/ intent subtitle
    MicButton.tsx                    -> oversized circular ripple button
    CelebrationOverlay.tsx           -> breakthrough card + particle flashes
    demoScript.ts                    -> hardcoded 5-step Binary Search script
  dashboard/
    LessonCard.tsx, BreakthroughCard.tsx, ResumeCTA.tsx
  passport/
    SkillCard.tsx (hover card w/ details)
  log/
    SessionTimelineItem.tsx
  types.ts                           -> LearningState, Intent, Message, Step

src/lib/
  learning-state-context.tsx         -> React context so sidebar/topbar reflect Engine state across routes
```

## Global state (cross-route)

`LearningStateProvider` mounted in `__root.tsx` exposes `{ state, setState, isSpeaking }`. The Engine drives it; other pages read it so the **AmbientBackground and sidebar accent tint stay in sync** even when the user wanders to Skill Passport mid-session. Resets to `IDLE` on `/engine` unmount via Reset, not on navigation.

```ts
type LearningState = 'IDLE' | 'FOCUS' | 'CHALLENGE' | 'CELEBRATE';
```

## Theme system

Tokens added in `src/styles.css` (oklch). State swapped via `data-state` attribute on `<html>` (set from context) so every page transitions together with `duration-700 ease-in-out`. Tokens: `--ambient-from/via/to`, `--glow`, `--accent`, `--aura`, `--surface-glass`, `--border-glass`. Registered in `@theme inline` so Tailwind utilities like `bg-ambient-from`, `border-border-glass`, `shadow-[0_0_80px_var(--glow)]` work.

State palettes:
- IDLE — deep indigo/charcoal `#0B0F19`, soft indigo orb
- FOCUS — sapphire + mist-blue, steady pulse
- CHALLENGE — obsidian + crimson/violet, sharp aura
- CELEBRATE — emerald + gold radial bursts

## Engine page (the centerpiece)

Top: `StepperBar` (Step 1–5 + Reset). Two-column grid `lg:grid-cols-[3fr_2fr]` (60/40), stacks on mobile.

**Mentor Canvas (60%)** — glass container (`backdrop-blur-xl`, `border border-white/10`, `box-shadow: 0 0 80px var(--glow)`); status pill "AI Status: {tag}" with pulsing dot; SVG `MentorAvatar` with posture variants (IDLE breathing, FOCUS lean, CHALLENGE crossed-arms + crimson eye glow, CELEBRATE arms-up + gold drop-shadow), all via `transition-transform duration-700`; bottom 24-bar waveform amplitude scales with `isSpeaking`.

**Debate Terminal (40%)** — topic card "Computational Thinking — The Dictionary Puzzle" with 5 progress dots (shadcn HoverCard on each); terminal-styled feed (`mentor@socratic:~$` mono prefix, `[Socratic Nudge]` intent subtitle in `--accent`, sans body, fade-in slide-up); dock with oversized circular `MicButton` (h-16 w-16, 3 expanding ripple rings, **visual only — no real audio**) + mono text input `> _`.

### Hardcoded demo script (per spec)

1. **FOCUS** — "If you need to find a specific word in a 1,000-page dictionary…" + student "page 1 to 1000".
2. **CHALLENGE** — `[Socratic Challenge]` split-in-half prompt.
3. **CHALLENGE** — student halving response + `[Socratic Nudge]` follow-up.
4. **CHALLENGE** — student "throw away the second half" breakthrough line.
5. **CELEBRATE** — triumphant copy + `CelebrationOverlay`: "Breakthrough! You just independently invented the Binary Search Algorithm."

Stepper advances/rewinds; Reset clears messages → IDLE.

## Other pages (content)

- **Dashboard** — hero "Resume your session" linking to `/engine`, current-lesson glass card, last-breakthrough card, quick stats (sessions, breakthroughs, hours).
- **Skill Passport** — grid of `SkillCard`s (Binary Search unlocked, Computational Thinking in progress, plus 4 locked placeholders), mastery bars, hover cards with discovery date + intent breakdown.
- **Architecture Log** — vertical timeline of mock sessions; each item: date, lesson, dominant intent tags, expandable transcript snippet.
- **Settings** — accent picker (indigo/sapphire/emerald), motion intensity slider, "Replay demo from start" button (routes to `/engine` + resets), about blurb. All UI-only.

## Micro-interactions

- All theme-affecting elements: `transition-[background,border-color,box-shadow,color] duration-700 ease-in-out`.
- shadcn HoverCard on progress dots + skill cards.
- Celebration: full-screen overlay, radial gold/emerald burst, 12 particle divs with staggered keyframe flashes, auto-dismiss after 3s or click.
- Mic ripple: 3 concentric expanding rings via keyframes.
- Sidebar nav: cyber icons (LayoutDashboard, Brain, BadgeCheck, ScrollText, Settings), active item gets `--accent` glow bar + bold label.
- Sidebar collapses to icon rail on `<lg`.

## Typography

Inter (sans) + JetBrains Mono via Google Fonts `<link>` in `__root.tsx` head. Mapped to `--font-sans` / `--font-mono`. Mono for terminal prefixes, status tags, stepper, mic command text. Inter for everything else.

## SEO / head

Per-route `head()` with distinct title + description + og:title + og:description. No og:image (no hero image generated). Examples:
- `/` — "Dashboard — The Socratic Engine"
- `/engine` — "The Socratic Engine — AI-Native Learning"
- `/skill-passport` — "Skill Passport — The Socratic Engine"
- `/architecture-log` — "Architecture Log — The Socratic Engine"
- `/settings` — "Settings — The Socratic Engine"

## Technical notes

- Pure frontend, no Cloud / server functions. No new npm deps.
- TanStack Start file-based routing; flat route files only (no `_app/` folder).
- `__root.tsx` keeps `<Outlet />` and renders Sidebar + AmbientBackground + TopBar around it.
- Avatar is a single SVG with conditional path groups — no external 3D libs.
- Mic does NOT request microphone permissions; visual simulation only.
- All colors via semantic tokens — no raw hex in JSX.

## Out of scope

Real STT/AI, persistence, auth, database, og:image generation.

Ready to build on approval.