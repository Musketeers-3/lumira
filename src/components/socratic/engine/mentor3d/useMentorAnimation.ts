import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { VRM } from "@pixiv/three-vrm";
import type { MentorAnimState } from "@/lib/mentor-animation-context";
import { retargetFbxToVrm } from "@/types/retargetFbxToVrm";
import { useMentorSettingsOptional } from "@/lib/mentor-settings-hooks";

const CROSSFADE_SEC = 0.55;
const CLAPPING_CROSSFADE_SEC = 0.35;

interface FbxSet {
  idle: THREE.Group;
  thinking: THREE.Group;
  talking: THREE.Group;
  clapping: THREE.Group;
}

interface Options {
  vrm: VRM | null;
  fbx: FbxSet | null;
  mentorState: MentorAnimState;
  onClappingFinished?: () => void;
}

export function useMentorAnimation({ vrm, fbx, mentorState, onClappingFinished }: Options) {
  const settings = useMentorSettingsOptional();
  const reducedMotion = settings?.reducedMotion ?? false;

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Partial<Record<MentorAnimState, THREE.AnimationAction>>>({});
  const currentStateRef = useRef<MentorAnimState | null>(null);
  const initializedRef = useRef(false);
  const onClappingFinishedRef = useRef(onClappingFinished);

  onClappingFinishedRef.current = onClappingFinished;

  // One-time mixer + retarget setup — never re-runs on React state changes.
  useEffect(() => {
    if (!vrm || !fbx || initializedRef.current) return;

    const mixer = new THREE.AnimationMixer(vrm.scene);
    mixerRef.current = mixer;

    const bind = (state: MentorAnimState, fbxGroup: THREE.Group) => {
      const source = fbxGroup.animations[0];
      if (!source) return;

      const clip = retargetFbxToVrm(source, vrm, fbxGroup, state);
      if (!clip) return;

      const action = mixer.clipAction(clip);
      action.setLoop(
        state === "clapping" ? THREE.LoopOnce : THREE.LoopRepeat,
        state === "clapping" ? 1 : Infinity,
      );
      if (state === "clapping") action.clampWhenFinished = true;
      actionsRef.current[state] = action;
    };

    bind("idle", fbx.idle);
    bind("thinking", fbx.thinking);
    bind("talking", fbx.talking);
    bind("clapping", fbx.clapping);

    const handleFinished = (event: THREE.Event & { action?: THREE.AnimationAction }) => {
      const clapping = actionsRef.current.clapping;
      if (event.action === clapping) {
        onClappingFinishedRef.current?.();
      }
    };
    mixer.addEventListener("finished", handleFinished);

    const idle = actionsRef.current.idle;
    if (idle) {
      idle.play();
      currentStateRef.current = "idle";
    }

    initializedRef.current = true;

    return () => {
      mixer.removeEventListener("finished", handleFinished);
      mixer.stopAllAction();
      mixer.uncacheRoot(vrm.scene);
      mixerRef.current = null;
      actionsRef.current = {};
      currentStateRef.current = null;
      initializedRef.current = false;
    };
  }, [vrm, fbx]);

  // Crossfade on mentor state changes — no mixer recreation, no full reset.
  useEffect(() => {
    const mixer = mixerRef.current;
    const actions = actionsRef.current;
    if (!mixer || !actions[mentorState]) return;
    if (currentStateRef.current === mentorState) return;

    const next = actions[mentorState]!;
    const prev = currentStateRef.current ? actions[currentStateRef.current] : null;
    const fade = mentorState === "clapping" ? CLAPPING_CROSSFADE_SEC : CROSSFADE_SEC;
    const timeScale = reducedMotion ? 0.72 : 1;

    next.enabled = true;
    next.setEffectiveTimeScale(timeScale);
    next.setLoop(
      mentorState === "clapping" ? THREE.LoopOnce : THREE.LoopRepeat,
      mentorState === "clapping" ? 1 : Infinity,
    );
    if (mentorState === "clapping") next.clampWhenFinished = true;

    if (prev && prev !== next) {
      next.reset().setEffectiveWeight(0).play();
      prev.crossFadeTo(next, fade, false);
    } else {
      next.reset().fadeIn(fade).play();
    }

    currentStateRef.current = mentorState;
  }, [mentorState, reducedMotion]);

  return mixerRef;
}
