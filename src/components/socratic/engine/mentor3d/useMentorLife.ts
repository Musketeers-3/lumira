import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VRMExpressionPresetName, type VRM } from "@pixiv/three-vrm";
import type { MentorAnimState } from "@/lib/mentor-animation-context";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";
import { MENTOR_STAGE } from "./mentorLayout";

interface Options {
  vrm: VRM | null;
  mentorState: MentorAnimState;
  isSpeaking: boolean;
  isPausing: boolean;
  lookTarget: [number, number, number] | null;
  mixerRef: React.RefObject<THREE.AnimationMixer | null>;
}

function safeSet(vrm: VRM, name: string, value: number) {
  const mgr = vrm.expressionManager;
  if (!mgr?.getExpression(name)) return;
  mgr.setValue(name, value);
}

function safeGet(vrm: VRM, name: string): number {
  const mgr = vrm.expressionManager;
  if (!mgr?.getExpression(name)) return 0;
  return mgr.getValue(name) ?? 0;
}

export function useMentorLife({
  vrm,
  mentorState,
  isSpeaking,
  isPausing,
  lookTarget,
  mixerRef,
}: Options) {
  const settings = useMentorSettingsOptional();
  const warmthBias = settings?.warmthBias ?? 0.6;
  const reducedMotion = settings?.reducedMotion ?? false;

  const blinkTimer = useRef(0);
  const nextBlink = useRef(2.5 + Math.random() * 4);
  const gazePhase = useRef(0);
  const celebrateBurst = useRef(0);
  const prevState = useRef<MentorAnimState>(mentorState);
  const lookTargetVec = useRef(new THREE.Vector3(0, 0.5, -1));

  useFrame((_, dt) => {
    if (mixerRef.current) mixerRef.current.update(dt);
    if (!vrm) return;

    const t = performance.now() / 1000;

    if (prevState.current !== mentorState) {
      if (mentorState === "clapping") celebrateBurst.current = 1.1;
      prevState.current = mentorState;
    }

    // VRM spring bones, constraints, and look-at applier.
    vrm.update(dt);

    if (!vrm.expressionManager) return;

    let tHappy = 0;
    let tRelaxed = 0;
    let tNeutral = 0;
    let tSurprised = 0;
    let tSad = 0;

    const breathPulse = !reducedMotion ? Math.sin(t * 1.1) * (mentorState === "idle" ? 0.04 : 0.02) : 0;

    if (mentorState === "idle") {
      tRelaxed = 0.25 + warmthBias * 0.15 + breathPulse;
      tHappy = 0.1 + warmthBias * 0.1;
    } else if (mentorState === "thinking") {
      tRelaxed = 0.35 + warmthBias * 0.1;
      tNeutral = 0.2;
    } else if (mentorState === "talking") {
      if (isPausing) {
        tSad = 0.12;
        tRelaxed = 0.2;
      } else {
        tNeutral = 0.25;
        tHappy = 0.1 + warmthBias * 0.05;
      }
    } else if (mentorState === "clapping") {
      tHappy = 0.65 + warmthBias * 0.25;
      tRelaxed = 0.3;
    }

    if (celebrateBurst.current > 0) {
      celebrateBurst.current = Math.max(0, celebrateBurst.current - dt);
      tSurprised = Math.max(tSurprised, 0.45 * (celebrateBurst.current / 1.1));
    }

    const damp = 2.5;
    safeSet(
      vrm,
      VRMExpressionPresetName.Happy,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Happy), tHappy, damp, dt),
    );
    safeSet(
      vrm,
      VRMExpressionPresetName.Relaxed,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Relaxed), tRelaxed, damp, dt),
    );
    safeSet(
      vrm,
      VRMExpressionPresetName.Neutral,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Neutral), tNeutral, damp, dt),
    );
    safeSet(
      vrm,
      VRMExpressionPresetName.Surprised,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Surprised), tSurprised, damp, dt),
    );
    safeSet(
      vrm,
      VRMExpressionPresetName.Sad,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Sad), tSad, damp, dt),
    );

    if (!reducedMotion) {
      blinkTimer.current += dt;
      if (blinkTimer.current >= nextBlink.current) {
        safeSet(vrm, VRMExpressionPresetName.Blink, 1);
        blinkTimer.current = 0;
        nextBlink.current = 2.5 + Math.random() * 4;
      } else {
        const cur = safeGet(vrm, VRMExpressionPresetName.Blink);
        if (cur > 0) {
          safeSet(vrm, VRMExpressionPresetName.Blink, THREE.MathUtils.damp(cur, 0, 12, dt));
        }
      }
    }

    // Look-at via VRM applier — does not fight skeletal animation tracks.
    if (vrm.lookAt?.target && !reducedMotion) {
      gazePhase.current += dt;
      const target = lookTargetVec.current;

      const [childX, childY, childZ] = MENTOR_STAGE.childGaze;
      const [worldX, worldY, worldZ] = MENTOR_STAGE.worldGlance;

      if (lookTarget) {
        // Student tapped an object in the world panel — glance right.
        target.set(worldX, worldY, worldZ);
      } else if (mentorState === "thinking" || mentorState === "talking") {
        const blend = mentorState === "thinking" ? 0.55 : 0.3;
        const sway = Math.sin(gazePhase.current * 0.5) * 0.15;
        target.set(
          THREE.MathUtils.lerp(childX, worldX, blend) + sway,
          THREE.MathUtils.lerp(childY, worldY, blend),
          THREE.MathUtils.lerp(childZ, worldZ, blend),
        );
      } else {
        target.set(
          childX + Math.sin(gazePhase.current * 0.35) * 0.05,
          childY + Math.sin(gazePhase.current * 0.22) * 0.03,
          childZ,
        );
      }

      vrm.lookAt.target.position.lerp(target, 0.08);
    }

    // Lip-sync layered on talking animation.
    if (isSpeaking && !isPausing) {
      const aa = Math.max(0, Math.sin(t * 14)) * 0.35;
      const ih = Math.max(0, Math.sin(t * 11 + 1.3)) * 0.2;
      const ou = Math.max(0, Math.sin(t * 9 + 2.1)) * 0.15;
      safeSet(vrm, VRMExpressionPresetName.Aa, aa);
      safeSet(vrm, VRMExpressionPresetName.Ih, ih);
      safeSet(vrm, VRMExpressionPresetName.Ou, ou);
    } else {
      safeSet(
        vrm,
        VRMExpressionPresetName.Aa,
        THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Aa), 0, 10, dt),
      );
      safeSet(
        vrm,
        VRMExpressionPresetName.Ih,
        THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Ih), 0, 10, dt),
      );
      safeSet(
        vrm,
        VRMExpressionPresetName.Ou,
        THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Ou), 0, 10, dt),
      );
    }
  });
}
