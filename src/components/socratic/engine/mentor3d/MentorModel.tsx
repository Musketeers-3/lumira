import { Suspense, useEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import { useMentorAnimationState, type MentorAnimState } from "@/lib/mentor-animation-context";
import { useMentorAnimation } from "./useMentorAnimation";
import { useMentorLife } from "./useMentorLife";
import { MENTOR_FBX_URLS, MENTOR_STAGE, MENTOR_VRM_URL } from "./mentorLayout";

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

  const gltf = useLoader(GLTFLoader, vrmUrl, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });

  const [idle, thinking, talking, clapping] = useLoader(FBXLoader, [
    MENTOR_FBX_URLS.idle,
    MENTOR_FBX_URLS.thinking,
    MENTOR_FBX_URLS.talking,
    MENTOR_FBX_URLS.clapping,
  ]);

  const vrm = useMemo(() => gltf.userData.vrm as VRM, [gltf]);
  const setupOnce = useRef(false);

  useEffect(() => {
    if (!vrm || setupOnce.current) return;
    vrm.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) obj.frustumCulled = false;
    });
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
      <primitive object={vrm.scene} />
    </group>
  );
}

useLoader.preload(GLTFLoader, MENTOR_VRM_URL, (loader) => {
  loader.register((parser) => new VRMLoaderPlugin(parser));
});
useLoader.preload(FBXLoader, MENTOR_FBX_URLS.idle);
useLoader.preload(FBXLoader, MENTOR_FBX_URLS.thinking);
useLoader.preload(FBXLoader, MENTOR_FBX_URLS.talking);
useLoader.preload(FBXLoader, MENTOR_FBX_URLS.clapping);

export function MentorModel(props: Props) {
  return (
    <Suspense fallback={null}>
      <MentorModelInner {...props} />
    </Suspense>
  );
}

export type { MentorAnimState };
export { useMentorAnimationState };
