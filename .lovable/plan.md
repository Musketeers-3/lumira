# Bring Lumira's VRM to life

Goal: upgrade `src/components/socratic/engine/mentor3d/MentorModel.tsx` so the loaded `mentor.vrm` feels alive — layered body motion and richer, smoothly-blended emotions tied to `LearningState` + `isSpeaking` + `isPausing`. Pure procedural animation on the VRM humanoid rig and expression manager; no new deps, no GLB swap, no backend.

## What changes

Single file: `src/components/socratic/engine/mentor3d/MentorModel.tsx`.

### 1. Motion system (humanoid bones)

Cache these bones on load (in addition to head/neck):
`spine`, `chest`, `upperChest`, `leftShoulder/UpperArm/LowerArm/Hand`, `rightShoulder/UpperArm/LowerArm/Hand`.

Per-frame, damp each bone toward a state-driven target pose (use `THREE.MathUtils.damp`, dt-based, so it stays framerate-independent):

- **Breath layer (always on):** `sin(t * rate) * amp` added to `spine.rotation.x` and `chest.rotation.x`. Rate/amp shift per state (slower+deeper in IDLE, quicker in CHALLENGE).
- **Idle sway:** very slow `sin(t*0.3)` on `spine.rotation.z` (~0.02 rad) so he's never frozen.
- **Per-state pose targets** (damped, not snapped):
  - IDLE — neutral arms down, slight open chest, soft head tilt right.
  - FOCUS — lean forward ~6° on spine, slight head-down nod, one hand subtly raised (right elbow bent ~0.4 rad) as if gesturing.
  - CHALLENGE — upright spine, arms crossed-ish (both upper arms rotated inward, lower arms folded up ~1.2 rad). If `isPausing`, add a slow head shake (`sin(t*0.6)*0.04` on head.y) + slight downward tilt.
  - CELEBRATE — chest lifted, shoulders back, both arms relaxed open (upper arms out ~0.3 rad), gentle bobbing nod (`sin(t*2)*0.05` on head.x).
- **Speaking gesture additive:** when `isSpeaking && !isPausing`, add small `sin(t*3)` wobble to right hand and chest so he "talks with his body".
- **Saccade-style gaze:** every 2–5s pick a small random target for head.y / head.x (±0.05 rad) and damp toward it, instead of the current single sine.

### 2. Emotion system (VRM expressions)

Keep current blink + Aa mouth, then layer:

- **Smooth expression blending:** instead of `setValue(..., 0)` hard reset each frame, damp every emotion channel (`Happy`, `Angry`, `Sad`, `Relaxed`, `Surprised`, `Neutral`) toward its target for the current state. Prevents pops on state changes.
- **State → expression mix:**
  - IDLE — `Relaxed` 0.25, `Happy` 0.1 (soft smile baseline).
  - FOCUS — `Relaxed` 0.4, `Happy` 0.15 (warm, attentive).
  - CHALLENGE (not pausing) — `Neutral` 0.3, `Happy` 0.1 (kind, not stern — drop the current Angry 0.15 which reads harsh and contradicts the Tanjiro-style empathy rules).
  - CHALLENGE + `isPausing` — `Sad` 0.15, `Relaxed` 0.2 (concerned, patient).
  - CELEBRATE — `Happy` 0.8, `Relaxed` 0.3, brief `Surprised` 0.4 burst that decays over ~1.2s on entry (joyful gasp).
- **Lip-sync improvement:** when speaking, drive `Aa`, `Ih`, `Ou` from three offset sine waves (e.g. `Aa = max(0, sin(t*14))*0.4`, `Ih = max(0, sin(t*11 + 1.3))*0.25`, `Ou = max(0, sin(t*9 + 2.1))*0.2`) so the mouth shape varies instead of flapping open/closed. Damp all three to 0 when silent.
- **Micro-expressions:** every 6–10s, briefly raise `Happy` by +0.1 for ~0.8s in IDLE/FOCUS (a "smile twitch") for life.
- **Blink:** keep current logic; add an occasional double-blink (10% chance) for naturalness.

### 3. State-change transitions

On `state` change, fade body pose targets and expression targets in over ~0.8s via the existing damp loop (no new timers needed — damp rate constants do the work). On entering CELEBRATE, trigger the one-shot `Surprised` burst with a ref-tracked timer.

## Out of scope

- No new files, no new deps.
- No real audio/lip-sync from mic.
- No swapping the VRM model or editing the spec doc.
- No changes to other components, routes, or styles.

## Risk / verification

- Some VRMs don't expose every expression preset (`Ih`, `Ou`, `Surprised`). Guard each `setValue` with an `expressions.getExpression(name)` check; skip silently if missing so it degrades to the current behavior.
- Some VRMs lack `upperChest` or `shoulder` bones. Each bone lookup already returns `null`; only animate when non-null.
- Verify by loading `/engine` and stepping through the demo: mentor should breathe in IDLE, lean+gesture in FOCUS, fold arms+soften in CHALLENGE, open up and beam in CELEBRATE, with no popping between states.
