import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { LearningState } from "../../types";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

export interface CharacterRefs {
  root: RefObject<THREE.Group>;
  torso: RefObject<THREE.Group>;
  head: RefObject<THREE.Group>;
  leftUpperArm: RefObject<THREE.Group>;
  leftLowerArm: RefObject<THREE.Group>;
  rightUpperArm: RefObject<THREE.Group>;
  rightLowerArm: RefObject<THREE.Group>;
  eyeL: RefObject<THREE.Group>;
  eyeR: RefObject<THREE.Group>;
  lidL: RefObject<THREE.Mesh>;
  lidR: RefObject<THREE.Mesh>;
  pupilL: RefObject<THREE.Mesh>;
  pupilR: RefObject<THREE.Mesh>;
  mouth: RefObject<THREE.Mesh>;
  coatMat: RefObject<THREE.MeshStandardMaterial>;
}

interface Options {
  state: LearningState;
  isSpeaking: boolean;
  isPausing: boolean;
  refs: CharacterRefs;
}

export function useCharacterLife({ state, isSpeaking, isPausing, refs }: Options) {
  const { camera } = useThree();
  const settings = useMentorSettingsOptional();
  const motionMult = settings?.motionMultiplier ?? 1;
  const warmthBias = settings?.warmthBias ?? 0.6;
  const reducedMotion = settings?.reducedMotion ?? false;

  const blinkTimer = useRef(0);
  const nextBlink = useRef(2.5 + Math.random() * 2.5);
  const gazePhase = useRef(0);

  useFrame((_, dt) => {
    const t = performance.now() / 1000;
    const {
      root,
      torso,
      head,
      leftUpperArm,
      leftLowerArm,
      rightUpperArm,
      rightLowerArm,
      eyeL,
      eyeR,
      lidL,
      lidR,
      pupilL,
      pupilR,
      mouth,
      coatMat,
    } = refs;

    if (!root.current) return;

    const damp = (c: number, g: number, lambda = 4) =>
      THREE.MathUtils.damp(c, g, lambda / motionMult, dt);

    // --- Posture Targets ---
    const lean =
      state === "FOCUS"
        ? -0.11
        : state === "CHALLENGE"
          ? isPausing
            ? 0.01
            : 0.05
          : state === "CELEBRATE"
            ? -0.06
            : -0.02;
    const headTiltX =
      state === "CHALLENGE"
        ? -0.07
        : state === "CELEBRATE"
          ? 0.09
          : state === "FOCUS"
            ? 0.04
            : 0.02;
    const headTiltY = isPausing ? 0 : Math.sin(t * 0.35) * (state === "FOCUS" ? 0.05 : 0.025);

    root.current.rotation.x = damp(root.current.rotation.x, lean);
    root.current.rotation.y = damp(
      root.current.rotation.y,
      reducedMotion ? 0 : Math.sin(t * 0.45) * 0.03,
    );

    if (head.current) {
      head.current.rotation.x = damp(head.current.rotation.x, headTiltX);
      head.current.rotation.y = damp(head.current.rotation.y, headTiltY);
    }

    // --- Arm Mechanics (Desk Reach) ---
    const deskReach = state === "FOCUS" ? -0.55 : state === "CHALLENGE" ? -0.48 : -0.42;
    const armSpread = state === "CHALLENGE" ? 0.12 : 0.08;

    [leftUpperArm, rightUpperArm].forEach((arm, i) => {
      if (arm.current) {
        arm.current.rotation.x = damp(arm.current.rotation.x, deskReach);
        arm.current.rotation.z = damp(
          arm.current.rotation.z,
          (i === 0 ? 1 : -1) * (0.35 + armSpread),
        );
      }
    });

    // --- Breathing & Blink ---
    if (torso.current) {
      const breath =
        1 +
        Math.sin(t * (state === "CHALLENGE" ? 1.3 : 0.9) * Math.PI * 2) *
          (reducedMotion ? 0.004 : 0.012);
      torso.current.scale.y = breath;
    }

    if (!reducedMotion && lidL.current && lidR.current) {
      blinkTimer.current += dt;
      if (blinkTimer.current >= nextBlink.current) {
        blinkTimer.current = 0;
        nextBlink.current = 2.5 + Math.random() * 3;
        lidL.current.scale.y = lidR.current.scale.y = 0.08;
      } else {
        lidL.current.scale.y = damp(lidL.current.scale.y, 1, 12);
        lidR.current.scale.y = damp(lidR.current.scale.y, 1, 12);
      }
    }

    // --- Speaking & Warmth ---
    if (mouth.current) {
      const open = isSpeaking && !isPausing ? 1 + (Math.sin(t * 5.5) + 1) * 0.35 : 1;
      mouth.current.scale.y = damp(mouth.current.scale.y, open, 8);
    }
  });
}
