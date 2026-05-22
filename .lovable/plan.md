
# Lumira — Tanjiro-Inspired 3D Mentor + Full Empathetic Rebrand

Transform "The Socratic Engine" into **Lumira**, an empathetic learning OS with a real-time 3D mentor (original "inspired-by" character — kind-eyed swordsman with checkered green/black haori, scar on left brow) that breathes, leans, and reacts to learning state. Rewrite all copy from challenge-driven to belief-driven mentorship.

## 1. Brand & Tone Rebrand

**Product name:** The Socratic Engine → **Lumira**
**Tagline:** "Learn beside someone who believes in you."

**Page titles / route copy** (`__root.tsx`, all route `head()`, sidebar, `TopBar`):
- Dashboard → "Your Path"
- Engine → "The Dojo"
- Skill Passport → "Your Light"
- Architecture Log → "Journey Log"
- Settings → "Settings"

**Intent label rewrites** (`types.ts`, `TerminalMessage.tsx`, `demoScript.ts`):
- `Socratic Nudge` → **Gentle Push**
- `Socratic Challenge` → **Believing Challenge**
- `Breakthrough` → **Light Found**
- `Student` → **You**

**Status pill copy** (`MentorCanvas.tsx`):
- IDLE → "Walking with you"
- FOCUS → "Listening kindly"
- CHALLENGE → "Believing in you"
- CELEBRATE → "Proud of you"

**Demo script** (`demoScript.ts`) — full rewrite of all 5 steps. Same Binary Search arc, Tanjiro-style voice. Examples:
- Old: "That works — but it could take all day."
- New: "That's a real solution — it would work. But you're stronger than that. What if you opened the dictionary right in the middle? I think you'll see something."
- Old: "You just independently invented the Binary Search Algorithm."
- New: "You did it. You didn't memorize this — you *found* it. That's Binary Search. And I knew you'd reach it."

Rewrite Dashboard/Skill Passport/Architecture Log/Settings body copy to match (encouragement, belief, no punishment language).

## 2. 3D Mentor (Three.js)

**Stack:** add `three`, `@react-three/fiber`, `@react-three/drei` via `bun add`.

**Character:** original "inspired-by" — no Tanjiro name or exact likeness. Built procedurally from primitives (no GLB needed, no IP risk, no asset hosting):
- Head: rounded sphere, warm peach material
- Hair: low-poly tousled dark-brown shape (clustered cones)
- Eyes: kind almond shape (flattened spheres), soft amber irises with subtle emissive glow
- Scar: thin red `MeshLine` strip across left brow
- Earrings: two small flat discs (hanafuda-style, hand-painted texture via canvas)
- Haori: green/black checkered pattern via a canvas-generated `CanvasTexture` applied to a draped torso mesh (cylinder + folds)
- Inner kimono: cream tone
- Belt: dark sash

Optional later: if user uploads a custom GLB, swap procedural model for it (out of scope this turn).

**File: `src/components/socratic/engine/Mentor3D.tsx`**
- `<Canvas camera={{ position: [0, 1.4, 2.6], fov: 32 }}>` inside the existing `MentorCanvas`.
- `<ambientLight />` + key/rim lights tinted by `--state-accent` (read via `getComputedStyle` on `useFrame` tick).
- `<MentorModel state isSpeaking />` group:
  - **Breathing:** torso scale.y `1 + sin(t * 1.2) * 0.015` (IDLE).
  - **Lean forward:** group rotation.x lerp toward `-0.08` in FOCUS.
  - **Crossed arms / lowered head:** in CHALLENGE, arm bones cross, head tilts down 4°, brow furrow via blend (procedural — slight scaleY on eyes).
  - **Arms-up triumph:** in CELEBRATE, arm groups rotate to raised pose, soft gold rim-light bloom.
  - **Speaking:** subtle jaw scale pulse + head bob `sin(t * 6) * 0.01` when `isSpeaking`.
- Soft contact shadow via `<ContactShadows />` from drei.
- Post-processing: a thin `<Environment preset="sunset" />` or simple HDR-free gradient backdrop for warmth.
- All motion via `useFrame`, lerped with `MathUtils.damp` for cinematic ease.

**Replace** `MentorAvatar.tsx` usage in `MentorCanvas.tsx` with `<Mentor3D />`. Keep `MentorAvatar.tsx` file as a 2D fallback (rendered if `webgl` unsupported — feature-detect once with `useEffect`).

**Performance:** `dpr={[1, 1.5]}`, `frameloop="always"` (needed for breathing). Single canvas only.

## 3. Palette Warm-Up (subtle)

Lumira's mentor is warm; the cyber-cold base feels off. Tweak `src/styles.css`:
- IDLE accent shifts from indigo → warm amber-cream: `oklch(0.82 0.10 75)` (still pairs with deep navy bg).
- CELEBRATE accent shifts emerald → soft gold: `oklch(0.88 0.14 90)`.
- FOCUS and CHALLENGE unchanged.

Glassmorphism, transitions, and state-driven background stay intact.

## 4. Files Touched

```
NEW   src/components/socratic/engine/Mentor3D.tsx          (Canvas + procedural model)
NEW   src/components/socratic/engine/mentor3d/MentorModel.tsx
NEW   src/components/socratic/engine/mentor3d/useHaoriTexture.ts  (canvas checkered texture)
EDIT  src/components/socratic/engine/MentorCanvas.tsx       (use Mentor3D, new status copy)
EDIT  src/components/socratic/engine/demoScript.ts          (5 steps, Tanjiro voice)
EDIT  src/components/socratic/engine/TerminalMessage.tsx    (new intent label colors)
EDIT  src/components/socratic/types.ts                       (new Intent union)
EDIT  src/components/socratic/Sidebar.tsx                    (Lumira brand, new nav labels)
EDIT  src/components/socratic/TopBar.tsx                     (Lumira title, new status copy)
EDIT  src/routes/__root.tsx                                  (title: Lumira)
EDIT  src/routes/index.tsx                                   (Your Path, empathetic copy)
EDIT  src/routes/engine.tsx                                  (The Dojo, head meta)
EDIT  src/routes/skill-passport.tsx                          (Your Light, copy)
EDIT  src/routes/architecture-log.tsx                        (Journey Log, copy)
EDIT  src/routes/settings.tsx                                (mentor warmth slider stub)
EDIT  src/styles.css                                         (warmer IDLE/CELEBRATE accents)
```

## 5. Technical notes

- New deps: `three`, `@react-three/fiber`, `@react-three/drei` (all MIT, edge-safe — client-only render).
- 3D Canvas runs client-only; wrap in dynamic mount guard (`useEffect` flag) to avoid SSR `window` errors.
- No GLB asset needed → no licensing risk, no asset hosting, ships immediately.
- 2D `MentorAvatar.tsx` retained as graceful fallback if WebGL unavailable.
- No new routes, no backend, no Cloud.
- Mic remains visual simulation.

## 6. Out of scope

- Real Tanjiro likeness/name (IP) — using original character per your choice.
- Uploaded GLB support (can add later if you provide a model).
- Real voice synthesis for the mentor.
- Lip-sync (jaw pulse approximates it).

Ready to build on approval.
