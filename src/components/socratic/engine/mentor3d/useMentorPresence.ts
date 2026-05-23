import { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LearningState } from "../../types";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

const CLIP_BY_STATE: Record<LearningState, string> = {
  IDLE: "idle_breathe",
  FOCUS: "focus_listen",
  CHALLENGE: "challenge_present",
  CELEBRATE: "celebrate_quiet",
};

const MORPH_BY_STATE: Record<LearningState, string> = {
  IDLE: "attentive",
  FOCUS: "encouraging",
  CHALLENGE: "thoughtful",
  CELEBRATE: "quiet_pride",
};

export interface MentorPresenceProps {
  state: LearningState;
  isSpeaking: boolean;
  isPausing: boolean;
  actions: Record<string, THREE.AnimationAction | null>;
  mixer: THREE.AnimationMixer | null;
  headMesh: THREE.Mesh | null;
  headBone: THREE.Bone | null;
}

export function useMentorPresence({
  state,
  isSpeaking,
  isPausing,
  actions,
  mixer,
  headMesh,
  headBone,
}: MentorPresenceProps) {
  const settings = useMentorSettingsOptional();
  const motionMult = settings?.motionMultiplier ?? 1;
  const warmthBias = settings?.warmthBias ?? 0.6;
  const reducedMotion = settings?.reducedMotion ?? false;

  const currentBase = useRef<string>(CLIP_BY_STATE.IDLE);
  const blinkTimer = useRef(0);
  const nextBlink = useRef(3 + Math.random() * 3);
  const gazePhase = useRef(0);

  const crossfadeTo = useCallback(
    (name: string, duration = 1.5) => {
      const next = actions[name];
      if (!next) return;
      const dur = (reducedMotion ? duration * 1.8 : duration) / motionMult;
      Object.entries(actions).forEach(([key, action]) => {
        if (!action || key === "speak_add") return;
        if (key === name) {
          action
            .reset()
            .setEffectiveTimeScale(reducedMotion ? 0.6 : 1)
            .fadeIn(dur)
            .play();
        } else if (action.isRunning()) {
          action.fadeOut(dur);
        }
      });
      currentBase.current = name;
    },
    [actions, motionMult, reducedMotion],
  );

  useEffect(() => {
    const base = isPausing && state === "CHALLENGE" ? "challenge_present" : CLIP_BY_STATE[state];
    crossfadeTo(base, state === "CELEBRATE" ? 1.8 : 1.4);
  }, [state, isPausing, crossfadeTo]);

  useEffect(() => {
    const speak = actions.speak_add;
    if (!speak) return;
    if (isSpeaking && !isPausing) {
      speak
        .reset()
        .setEffectiveWeight(0.3)
        .fadeIn(0.4 / motionMult)
        .play();
    } else {
      speak.fadeOut(0.3 / motionMult);
    }
  }, [isSpeaking, isPausing, actions.speak_add, motionMult]);

  useFrame((_, dt) => {
    if (mixer) mixer.update(dt);
    gazePhase.current += dt * (reducedMotion ? 0.3 : 0.6);

    // Morph expression bias
    if (headMesh?.morphTargetDictionary && headMesh.morphTargetInfluences) {
      const dict = headMesh.morphTargetDictionary;
      const inf = headMesh.morphTargetInfluences;
      const targetName = MORPH_BY_STATE[state];
      const encouragingIdx = dict.encouraging;

      Object.keys(dict).forEach((key) => {
        const i = dict[key];
        if (key === "blink") return;
        const isTarget = key === targetName;
        const target = isTarget ? 0.12 + warmthBias * 0.13 : 0;
        inf[i] = THREE.MathUtils.damp(inf[i] ?? 0, target, 3, dt);
      });

      if (encouragingIdx !== undefined && state === "FOCUS") {
        inf[encouragingIdx] = THREE.MathUtils.damp(
          inf[encouragingIdx] ?? 0,
          0.15 + warmthBias * 0.1,
          3,
          dt,
        );
      }

      // Blink
      if (!reducedMotion && dict.blink !== undefined) {
        blinkTimer.current += dt;
        if (blinkTimer.current >= nextBlink.current) {
          blinkTimer.current = 0;
          nextBlink.current = 3 + Math.random() * 3;
          const blinkIdx = dict.blink;
          inf[blinkIdx] = 1;
        }
        if (inf[dict.blink] > 0) {
          inf[dict.blink] = THREE.MathUtils.damp(inf[dict.blink], 0, 12, dt);
        }
      }
    }

    // Subtle gaze on head bone
    if (headBone && !reducedMotion) {
      const gazeX = Math.sin(gazePhase.current * 0.4) * (state === "FOCUS" ? 0.04 : 0.02);
      const gazeY = Math.sin(gazePhase.current * 0.25) * 0.02;
      headBone.rotation.y = THREE.MathUtils.damp(headBone.rotation.y, gazeX, 2, dt);
      headBone.rotation.z = THREE.MathUtils.damp(headBone.rotation.z, gazeY, 2, dt);
    }
  });

  return { crossfadeTo, clipForState: CLIP_BY_STATE[state] };
}
