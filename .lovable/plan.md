## Goal

Rewrite all learner-facing content so Lumira teaches **scientific reasoning & critical thinking** for **Grades 6–12** instead of computational thinking / DSA. No architecture, mentor-state machine, 3D mentor, persistence, or UI styling changes — only content, copy, and the demo script.

## New flagship lesson

Replace **Binary Search / Dictionary Puzzle** with:

**"Why Doesn't the Moon Fall to Earth?"**

- Topic: Gravity, orbits, and Newton's insight
- Learning objective: Discover that an orbit is continuous _falling_ combined with sideways motion — gravity doesn't stop, the Moon keeps missing the Earth
- 5 Socratic steps mapped to existing FOCUS → CHALLENGE → CHALLENGE → CHALLENGE → CELEBRATE arc:
  1. FOCUS — "If I drop an apple it falls. The Moon feels gravity too. So why doesn't it crash into us?"
  2. CHALLENGE — Believing challenge: "What if you threw a ball so fast it never landed? Imagine throwing it from a mountain…"
  3. CHALLENGE — Gentle push: "As it falls, the Earth curves away beneath it. What happens then?"
  4. CHALLENGE — "So the Moon _is_ falling — but always missing. Why does it never hit?"
  5. CELEBRATE — "You discovered an orbit yourself: a perpetual fall that keeps missing the ground. That's how every planet, every satellite stays up."

## Files to edit (content-only)

### 1. `src/components/socratic/engine/demoScript.ts`

Replace all 5 steps with the Moon lesson dialogue above (keep `Step` shape, intents, and `celebrate: true` on step 5).

### 2. `src/components/socratic/engine/SocraticEngine.tsx`

- `AI_CONTEXT.lessonTopic` → `"Why Doesn't the Moon Fall to Earth?"`
- `AI_CONTEXT.learningObjective` → orbit-as-perpetual-falling description
- Default props `lessonId="moon-orbit-demo"`, `topic="Newtonian Gravity & Orbits"`
- Rewrite `INTENT_REPLIES` strings to science-reasoning tone (no "halving the search space")

### 3. `src/components/socratic/engine/InteractiveDebateTerminal.tsx`

- Lesson card: `Computational Thinking` → `Physical Reasoning`; subtitle `The Dictionary Puzzle` → `The Falling Moon`
- 5 step hover hints rewritten:
  1. Frame the puzzle.
  2. Throw the ball harder.
  3. Watch the Earth curve.
  4. Falling, always missing.
  5. Breakthrough — an orbit.

### 4. `src/routes/index.tsx` (Dashboard / Your Path)

- Hero headline: "We were close to something on **Binary Search**" → "**Why the Moon doesn't fall.**"
- "Where we are" card: `Computational Thinking` → `Physical Reasoning`, `The Dictionary Puzzle — Step 3 of 5` → `The Falling Moon — Step 3 of 5`
- "Light you found" card: `Recursion as Self-Reference` → `Pressure as Collisions`, italic quote → "Air isn't empty — it's countless tiny particles bumping into everything."
- Stats sub-labels stay neutral (sessions / light found / time)

### 5. `src/routes/skill-passport.tsx`

Replace the 6-skill array with school-level science/critical-thinking categories:

| name                 | domain             | mastery | status      | insight                                    |
| -------------------- | ------------------ | ------- | ----------- | ------------------------------------------ |
| Orbits & Gravity     | Physical Reasoning | 92      | unlocked    | An orbit is falling while moving sideways. |
| Pressure & Particles | Matter & Energy    | 78      | unlocked    | Pressure is countless tiny collisions.     |
| Scientific Method    | Meta-skill         | 64      | in-progress | Observe, hypothesize, test, revise.        |
| Evaluating Evidence  | Critical Thinking  | 40      | in-progress | Distinguish correlation from cause.        |
| Energy Transfer      | Physical Reasoning | 0       | locked      | —                                          |
| Ecosystem Balance    | Life Science       | 0       | locked      | —                                          |

Header eyebrow stays "ideas you reached on your own".

### 6. `src/components/socratic/Sidebar.tsx`

Any "Computational Thinking" / "Algorithms" labels → "Physical Reasoning" / "Scientific Method". (Confirm during edit; structure untouched.)

### 7. `src/lib/mentor-personality.ts`

- `STATE_EXAMPLE_LINES` rewritten for science contexts (e.g., CHALLENGE example: "That works for one apple. What changes when the object is the size of the Moon, moving sideways at 1 km/s?")
- Keep tone, length, and `STATE_PROMPT_ADDENDA` structure identical

### 8. `src/routes/engine.tsx`

Meta description swap: "reason your way to ideas" stays, but title can remain "The Dojo — Lumira" (generic, no change needed). No edit unless `Binary Search` appears.

### 9. `src/components/lesson-builder/*` (LessonBuilder, LessonsList)

Update any seeded example lesson titles / placeholder copy that reference algorithms → use science examples ("Why is the sky blue?", "What keeps a boat afloat?"). Schema unchanged.

## Audience & tone calibration (Grades 6–12)

- Vocabulary: middle-school accessible, no jargon without unpacking
- Examples: everyday physical world (apples, balls, water, light, weather, plants)
- Mentor restraint preserved — no hype, 1–2 questions per turn, Socratic
- Keep the cinematic editorial typography & onyx aesthetic

## Out of scope

- Mentor 3D rig, lights, animations
- `learning-state-context`, persistence hooks, AI gateway plumbing
- Theme tokens, layout, navigation structure
- Routes: `architecture-log`, `settings` (no learner-facing science copy there)

## Verification

After edits: load `/`, `/engine`, `/skill-passport` in the preview; walk all 5 demo steps; confirm no remaining "Binary Search", "Dictionary", "Recursion", or "Big-O" strings via `rg`.
