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

    // --- Posture targets (seated guide across the desk) ---
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

    // --- Arms: hands on desk, never crossed / raised ---
    const deskReach = state === "FOCUS" ? -0.55 : state === "CHALLENGE" ? -0.48 : -0.42;
    const armSpread = state === "CHALLENGE" ? 0.12 : 0.08;

    if (leftUpperArm.current) {
      leftUpperArm.current.rotation.x = damp(leftUpperArm.current.rotation.x, deskReach);
      leftUpperArm.current.rotation.z = damp(leftUpperArm.current.rotation.z, 0.35 + armSpread);
    }
    if (leftLowerArm.current) {
      leftLowerArm.current.rotation.x = damp(leftLowerArm.current.rotation.x, -0.35);
    }
    if (rightUpperArm.current) {
      rightUpperArm.current.rotation.x = damp(rightUpperArm.current.rotation.x, deskReach);
      rightUpperArm.current.rotation.z = damp(
        rightUpperArm.current.rotation.z,
        -(0.35 + armSpread),
      );
    }
    if (rightLowerArm.current) {
      rightLowerArm.current.rotation.x = damp(rightLowerArm.current.rotation.x, -0.35);
    }

    // --- Breathing ---
    if (torso.current) {
      const freq = state === "CHALLENGE" ? 1.3 : 0.9;
      const amp = reducedMotion ? 0.004 : 0.012;
      const breath = 1 + Math.sin(t * freq * Math.PI * 2) * amp;
      torso.current.scale.y = breath;
      torso.current.position.y = Math.sin(t * freq * Math.PI * 2) * 0.004;
    }

    // --- Blink ---
    if (!reducedMotion && lidL.current && lidR.current) {
      blinkTimer.current += dt;
      if (blinkTimer.current >= nextBlink.current) {
        blinkTimer.current = 0;
        nextBlink.current = 2.5 + Math.random() * 3;
        lidL.current.scale.y = 0.08;
        lidR.current.scale.y = 0.08;
      } else {
        lidL.current.scale.y = damp(lidL.current.scale.y, 1, 12);
        lidR.current.scale.y = damp(lidR.current.scale.y, 1, 12);
      }
    }

    // --- Gaze toward camera (student POV) ---
    gazePhase.current += dt * 0.5;
    if (head.current && pupilL.current && pupilR.current && !reducedMotion) {
      const headWorld = new THREE.Vector3();
      head.current.getWorldPosition(headWorld);
      const toCam = new THREE.Vector3().subVectors(camera.position, headWorld);
      const gazeX = THREE.MathUtils.clamp(toCam.x * 0.12, -0.022, 0.022);
      const gazeY = THREE.MathUtils.clamp(toCam.y * 0.06, -0.01, 0.01);
      const microX = Math.sin(gazePhase.current * 0.4) * 0.004;
      const microY = Math.sin(gazePhase.current * 0.28) * 0.003;

      pupilL.current.position.x = damp(pupilL.current.position.x, gazeX + microX, 3);
      pupilL.current.position.y = damp(pupilL.current.position.y, gazeY + microY, 3);
      pupilR.current.position.x = damp(pupilR.current.position.x, gazeX + microX, 3);
      pupilR.current.position.y = damp(pupilR.current.position.y, gazeY + microY, 3);

      if (eyeL.current && eyeR.current) {
        eyeL.current.rotation.y = damp(eyeL.current.rotation.y, gazeX * 2, 2);
        eyeR.current.rotation.y = damp(eyeR.current.rotation.y, gazeX * 2, 2);
      }
    }

    // --- Speaking ---
    if (mouth.current) {
      if (isSpeaking && !isPausing) {
        const open = 1 + (Math.sin(t * 5.5) + 1) * 0.35;
        mouth.current.scale.y = damp(mouth.current.scale.y, open, 8);
      } else {
        mouth.current.scale.y = damp(mouth.current.scale.y, 1, 6);
      }
    }

    // --- Warmth-reactive coat rim ---
    if (coatMat.current) {
      const pulse =
        state === "CELEBRATE"
          ? 0.08 + warmthBias * 0.06
          : state === "CHALLENGE"
            ? 0.04 + warmthBias * 0.03
            : 0.02 + warmthBias * 0.02;
      coatMat.current.emissiveIntensity =
        pulse + (isSpeaking && !isPausing ? Math.sin(t * 4) * 0.02 : 0);
    }
  });
}
