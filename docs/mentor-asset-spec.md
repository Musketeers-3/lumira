# Lumira Mentor — 3D Asset Specification

## Character

- **Name:** Lumira (internal asset id: `lumira.glb`)
- **Style:** Stylized human study guide — seated, cardigan/coat, warm approachable face
- **Restrictions:** No franchise likeness, scar, mascot energy, or exaggerated expressions

## Rig (minimum bones)

| Bone    | Parent | Purpose                  |
| ------- | ------ | ------------------------ |
| `Root`  | —      | Seated base, breath sway |
| `Spine` | Root   | Torso lean               |
| `Chest` | Spine  | Upper body               |
| `Head`  | Chest  | Tilt, gaze, nod          |
| `EyeL`  | Head   | Optional gaze            |
| `EyeR`  | Head   | Optional gaze            |

## Animation clips (embedded in GLB)

| Clip name           | Duration | Description                                          |
| ------------------- | -------- | ---------------------------------------------------- |
| `idle_breathe`      | 4s loop  | Slow seated breath, micro head drift                 |
| `focus_listen`      | 3s loop  | Slight forward lean (~8°), attentive stillness       |
| `challenge_present` | 3s loop  | Upright, still; hand-on-desk implied via chest angle |
| `celebrate_quiet`   | 3s loop  | Soft exhale, subtle nod; hands remain low            |
| `speak_add`         | 2s loop  | Low-amplitude jaw/chest micro-motion (additive)      |

**Amplitude rule:** All rotations < 0.15 rad; no arms-above-shoulder poses.

## Morph targets (mesh: `Head`)

| Name          | Max weight in app |
| ------------- | ----------------- |
| `attentive`   | 0.25              |
| `thoughtful`  | 0.25              |
| `encouraging` | 0.25              |
| `quiet_pride` | 0.25              |
| `blink`       | 1.0 (momentary)   |

## Export settings

- Format: glTF 2.0 binary (`.glb`)
- Scale: 1 unit = 1 meter; character ~1.7m seated height
- Path: `public/models/mentor/lumira.glb`
- Optional: Draco compression for production
- Include: animations, morph targets, PBR materials (roughness 0.7–0.9)

## Runtime mapping

| `LearningState` | Base clip           | Morph bias        |
| --------------- | ------------------- | ----------------- |
| IDLE            | `idle_breathe`      | `attentive` 0.1   |
| FOCUS           | `focus_listen`      | `encouraging` 0.2 |
| CHALLENGE       | `challenge_present` | `thoughtful` 0.2  |
| CELEBRATE       | `celebrate_quiet`   | `quiet_pride` 0.2 |

`isSpeaking` → blend `speak_add` at 0.3 weight.

## Regeneration

```bash
bun run scripts/generate-mentor-glb.mjs
```

Interim placeholder GLB is generated programmatically; replace with Blender-authored asset matching this spec for production quality.
