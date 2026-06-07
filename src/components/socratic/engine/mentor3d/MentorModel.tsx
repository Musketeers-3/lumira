/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import { useMentorAnimationState, type MentorAnimState } from "@/lib/mentor-animation-context";
import { useMentorAnimation } from "./useMentorAnimation";
import { useMentorLife } from "./useMentorLife";
import { MENTOR_FBX_URLS, MENTOR_STAGE, MENTOR_VRM_URL } from "./mentorLayout";
import { useFBX, useGLTF } from "@react-three/drei";

interface Props {
  isSpeaking?: boolean;
  isPausing?: boolean;
  lookTarget?: [number, number, number] | null;
  vrmUrl?: string;
}

function MentorModelInner({
  isSpeaking = false,
  isPausing = false,
  lookTarget = null,
  vrmUrl = MENTOR_VRM_URL,
}: Props) {
  const { mentorState, setMentorState } = useMentorAnimationState();
  const [vrm, setVrm] = useState<VRM | null>(null);

  const { scene, userData } = useGLTF(vrmUrl, false, false, (loader: any) => {
    loader.register((parser: any) => new VRMLoaderPlugin(parser));
  });

  const idle = useFBX(MENTOR_FBX_URLS.idle);
  const thinking = useFBX(MENTOR_FBX_URLS.thinking);
  const talking = useFBX(MENTOR_FBX_URLS.talking);
  const clapping = useFBX(MENTOR_FBX_URLS.clapping);

  // Now, userData.vrm WILL exist!
  useEffect(() => {
    if (userData.vrm) {
      setVrm(userData.vrm as VRM);
    }
  }, [userData]);

  const setupOnce = useRef(false);

  useEffect(() => {
    if (!vrm || setupOnce.current) return;

    vrm.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.frustumCulled = false;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    vrm.scene.updateMatrixWorld(true);
    setupOnce.current = true;
  }, [vrm]);

  const mixerRef = useMentorAnimation({
    vrm,
    fbx: { idle, thinking, talking, clapping },
    mentorState,
    onClappingFinished: () => setMentorState("idle"),
  });

  useMentorLife({
    vrm,
    mentorState,
    isSpeaking,
    isPausing,
    lookTarget,
    mixerRef,
  });

  if (!vrm) return null;

  return (
    <group
      position={MENTOR_STAGE.position}
      rotation={MENTOR_STAGE.rotation}
      scale={MENTOR_STAGE.scale}
    >
      <primitive object={vrm.scene} dispose={null} />
    </group>
  );
}

useGLTF.preload(MENTOR_VRM_URL, false, false, (loader: any) => {
  loader.register((parser: any) => new VRMLoaderPlugin(parser));
});
useFBX.preload(MENTOR_FBX_URLS.idle);
useFBX.preload(MENTOR_FBX_URLS.thinking);
useFBX.preload(MENTOR_FBX_URLS.talking);
useFBX.preload(MENTOR_FBX_URLS.clapping);

export function MentorModel(props: Props) {
  return (
    <Suspense fallback={null}>
      <MentorModelInner {...props} />
    </Suspense>
  );
}

export type { MentorAnimState };
export { useMentorAnimationState };
