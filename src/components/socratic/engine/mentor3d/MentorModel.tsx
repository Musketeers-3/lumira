// import { useEffect, useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { VRMLoaderPlugin, VRM, VRMExpressionPresetName } from "@pixiv/three-vrm";
// import type { LearningState } from "../../types";

// interface Props {
//   state: LearningState;
//   isSpeaking: boolean;
//   isPausing?: boolean;
//   vrmUrl?: string;
// }

// type BoneRef = THREE.Object3D | null;

// interface BoneSet {
//   spine: BoneRef;
//   chest: BoneRef;
//   upperChest: BoneRef;
//   head: BoneRef;
//   neck: BoneRef;
//   lShoulder: BoneRef;
//   rShoulder: BoneRef;
//   lUpperArm: BoneRef;
//   rUpperArm: BoneRef;
//   lLowerArm: BoneRef;
//   rLowerArm: BoneRef;
//   lHand: BoneRef;
//   rHand: BoneRef;
// }

// // Per-state target poses for the body rig. Values are euler rotations (rad).
// interface PoseTarget {
//   spineX: number;
//   spineZ: number;
//   chestX: number;
//   lUpperArmZ: number;
//   rUpperArmZ: number;
//   lUpperArmX: number;
//   rUpperArmX: number;
//   lLowerArmX: number;
//   rLowerArmX: number;
//   headX: number;
//   headZ: number;
// }

// const POSES: Record<LearningState, PoseTarget> = {
//   IDLE: {
//     spineX: 0,
//     spineZ: 0,
//     chestX: -0.02,
//     lUpperArmZ: -1.2,
//     rUpperArmZ: 1.2,
//     lUpperArmX: 0,
//     rUpperArmX: 0,
//     lLowerArmX: 0,
//     rLowerArmX: 0,
//     headX: 0,
//     headZ: 0.04,
//   },
//   FOCUS: {
//     spineX: 0.1,
//     spineZ: 0,
//     chestX: 0.05,
//     lUpperArmZ: -1.15,
//     rUpperArmZ: 1.0,
//     lUpperArmX: 0,
//     rUpperArmX: -0.2,
//     lLowerArmX: 0,
//     rLowerArmX: -0.6,
//     headX: 0.05,
//     headZ: 0,
//   },
//   CHALLENGE: {
//     spineX: -0.04,
//     spineZ: 0,
//     chestX: 0,
//     lUpperArmZ: -0.7,
//     rUpperArmZ: 0.7,
//     lUpperArmX: 0,
//     rUpperArmX: 0,
//     lLowerArmX: -1.2,
//     rLowerArmX: -1.2,
//     headX: 0.02,
//     headZ: 0,
//   },
//   CELEBRATE: {
//     spineX: -0.06,
//     spineZ: 0,
//     chestX: -0.04,
//     lUpperArmZ: -0.95,
//     rUpperArmZ: 0.95,
//     lUpperArmX: 0,
//     rUpperArmX: 0,
//     lLowerArmX: -0.2,
//     rLowerArmX: -0.2,
//     headX: -0.05,
//     headZ: 0,
//   },
// };

// // Soft setter that only acts if the expression exists on this VRM
// function safeSet(vrm: VRM, name: string, value: number) {
//   const mgr = vrm.expressionManager;
//   if (!mgr) return;
//   if (!mgr.getExpression(name)) return;
//   mgr.setValue(name, value);
// }

// function safeGet(vrm: VRM, name: string): number {
//   const mgr = vrm.expressionManager;
//   if (!mgr) return 0;
//   if (!mgr.getExpression(name)) return 0;
//   return mgr.getValue(name) ?? 0;
// }

// export function MentorModel({
//   state,
//   isSpeaking,
//   isPausing = false,
//   vrmUrl = "/models/mentor.vrm",
// }: Props) {
//   const [vrm, setVrm] = useState<VRM | null>(null);
//   const bones = useRef<BoneSet>({
//     spine: null,
//     chest: null,
//     upperChest: null,
//     head: null,
//     neck: null,
//     lShoulder: null,
//     rShoulder: null,
//     lUpperArm: null,
//     rUpperArm: null,
//     lLowerArm: null,
//     rLowerArm: null,
//     lHand: null,
//     rHand: null,
//   });

//   const blinkTimer = useRef(0);
//   const nextBlink = useRef(3 + Math.random() * 3);
//   const doubleBlinkPending = useRef(false);

//   const gazeTimer = useRef(0);
//   const nextGaze = useRef(2 + Math.random() * 3);
//   const gazeTargetY = useRef(0);
//   const gazeTargetX = useRef(0);

//   const microTimer = useRef(0);
//   const nextMicro = useRef(6 + Math.random() * 4);
//   const microActive = useRef(0); // remaining seconds

//   const celebrateBurst = useRef(0); // remaining seconds for Surprised burst
//   const prevState = useRef<LearningState>(state);

//   // Load VRM
//   useEffect(() => {
//     const loader = new GLTFLoader();
//     loader.register((parser) => new VRMLoaderPlugin(parser));

//     let disposed = false;
//     let loaded: VRM | null = null;

//     loader.load(
//       vrmUrl,
//       (gltf) => {
//         if (disposed) return;
//         const loadedVrm = gltf.userData.vrm as VRM;
//         loaded = loadedVrm;
//         loadedVrm.scene.rotation.y = 0;

//         const h = loadedVrm.humanoid;
//         if (h) {
//           bones.current = {
//             spine: h.getNormalizedBoneNode("spine"),
//             chest: h.getNormalizedBoneNode("chest"),
//             upperChest: h.getNormalizedBoneNode("upperChest"),
//             head: h.getNormalizedBoneNode("head"),
//             neck: h.getNormalizedBoneNode("neck"),
//             lShoulder: h.getNormalizedBoneNode("leftShoulder"),
//             rShoulder: h.getNormalizedBoneNode("rightShoulder"),
//             lUpperArm: h.getNormalizedBoneNode("leftUpperArm"),
//             rUpperArm: h.getNormalizedBoneNode("rightUpperArm"),
//             lLowerArm: h.getNormalizedBoneNode("leftLowerArm"),
//             rLowerArm: h.getNormalizedBoneNode("rightLowerArm"),
//             lHand: h.getNormalizedBoneNode("leftHand"),
//             rHand: h.getNormalizedBoneNode("rightHand"),
//           };
//         }

//         // Initialise arm rest pose
//         if (bones.current.lUpperArm) bones.current.lUpperArm.rotation.z = -1.2;
//         if (bones.current.rUpperArm) bones.current.rUpperArm.rotation.z = 1.2;

//         loadedVrm.scene.traverse((obj) => {
//           if ((obj as THREE.Mesh).isMesh) obj.frustumCulled = false;
//         });

//         setVrm(loadedVrm);
//       },
//       undefined,
//       (error) => console.error("Failed to load VRM:", error),
//     );

//     return () => {
//       disposed = true;
//       const v = loaded;
//       if (v) {
//         v.scene.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.geometry.dispose();
//             if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
//             else child.material.dispose();
//           }
//         });
//       }
//     };
//   }, [vrmUrl]);

//   // Trigger CELEBRATE entry burst
//   useEffect(() => {
//     if (prevState.current !== state) {
//       if (state === "CELEBRATE") celebrateBurst.current = 1.2;
//       prevState.current = state;
//     }
//   }, [state]);

//   useFrame((_, dt) => {
//     if (!vrm) return;
//     const t = performance.now() / 1000;
//     vrm.update(dt);

//     const b = bones.current;
//     const pose = POSES[state];

//     // ---------- BODY MOTION ----------
//     // Breath
//     const breathRate = state === "CHALLENGE" ? 1.5 : state === "CELEBRATE" ? 1.4 : 1.0;
//     const breathAmp = state === "IDLE" ? 0.025 : 0.018;
//     const breath = Math.sin(t * breathRate) * breathAmp;

//     // Idle sway
//     const sway = Math.sin(t * 0.3) * 0.02;

//     // Speaking additive wobble
//     const speakWob = isSpeaking && !isPausing ? Math.sin(t * 3) * 0.03 : 0;

//     // Pausing / celebrate special head motions
//     const headShake = state === "CHALLENGE" && isPausing ? Math.sin(t * 0.6) * 0.04 : 0;
//     const celebrateBob = state === "CELEBRATE" ? Math.sin(t * 2) * 0.05 : 0;

//     if (b.spine) {
//       b.spine.rotation.x = THREE.MathUtils.damp(b.spine.rotation.x, pose.spineX + breath, 2, dt);
//       b.spine.rotation.z = THREE.MathUtils.damp(b.spine.rotation.z, pose.spineZ + sway, 2, dt);
//     }
//     if (b.chest) {
//       b.chest.rotation.x = THREE.MathUtils.damp(
//         b.chest.rotation.x,
//         pose.chestX + breath * 0.5 + speakWob * 0.4,
//         2,
//         dt,
//       );
//     }

//     if (b.lUpperArm) {
//       b.lUpperArm.rotation.z = THREE.MathUtils.damp(b.lUpperArm.rotation.z, pose.lUpperArmZ, 2, dt);
//       b.lUpperArm.rotation.x = THREE.MathUtils.damp(b.lUpperArm.rotation.x, pose.lUpperArmX, 2, dt);
//     }
//     if (b.rUpperArm) {
//       b.rUpperArm.rotation.z = THREE.MathUtils.damp(b.rUpperArm.rotation.z, pose.rUpperArmZ, 2, dt);
//       b.rUpperArm.rotation.x = THREE.MathUtils.damp(b.rUpperArm.rotation.x, pose.rUpperArmX, 2, dt);
//     }
//     if (b.lLowerArm) {
//       b.lLowerArm.rotation.x = THREE.MathUtils.damp(b.lLowerArm.rotation.x, pose.lLowerArmX, 2, dt);
//     }
//     if (b.rLowerArm) {
//       b.rLowerArm.rotation.x = THREE.MathUtils.damp(b.rLowerArm.rotation.x, pose.rLowerArmX, 2, dt);
//     }

//     if (b.rHand && isSpeaking && !isPausing) {
//       b.rHand.rotation.x = Math.sin(t * 3.4) * 0.15;
//       b.rHand.rotation.z = Math.cos(t * 2.6) * 0.1;
//     }

//     if (b.neck) {
//       b.neck.rotation.x = THREE.MathUtils.damp(b.neck.rotation.x, breath * 0.8, 3, dt);
//     }

//     // Saccade gaze
//     gazeTimer.current += dt;
//     if (gazeTimer.current >= nextGaze.current) {
//       gazeTimer.current = 0;
//       nextGaze.current = 2 + Math.random() * 3;
//       gazeTargetY.current = (Math.random() - 0.5) * 0.1;
//       gazeTargetX.current = (Math.random() - 0.5) * 0.06;
//     }

//     if (b.head) {
//       const tgtX = pose.headX + celebrateBob + gazeTargetX.current;
//       const tgtY = headShake + gazeTargetY.current;
//       const tgtZ = pose.headZ;
//       b.head.rotation.x = THREE.MathUtils.damp(b.head.rotation.x, tgtX, 2.5, dt);
//       b.head.rotation.y = THREE.MathUtils.damp(b.head.rotation.y, tgtY, 2.5, dt);
//       b.head.rotation.z = THREE.MathUtils.damp(b.head.rotation.z, tgtZ, 2.5, dt);
//     }

//     // ---------- EMOTIONS ----------
//     const mgr = vrm.expressionManager;
//     if (!mgr) return;

//     // Target weights per state
//     let tHappy = 0;
//     let tAngry = 0;
//     let tSad = 0;
//     let tRelaxed = 0;
//     let tNeutral = 0;
//     let tSurprised = 0;

//     if (state === "IDLE") {
//       tRelaxed = 0.25;
//       tHappy = 0.1;
//     } else if (state === "FOCUS") {
//       tRelaxed = 0.4;
//       tHappy = 0.15;
//     } else if (state === "CHALLENGE") {
//       if (isPausing) {
//         tSad = 0.15;
//         tRelaxed = 0.2;
//       } else {
//         tNeutral = 0.3;
//         tHappy = 0.1;
//       }
//     } else if (state === "CELEBRATE") {
//       tHappy = 0.8;
//       tRelaxed = 0.3;
//     }

//     // Celebrate gasp burst
//     if (celebrateBurst.current > 0) {
//       celebrateBurst.current = Math.max(0, celebrateBurst.current - dt);
//       tSurprised = Math.max(tSurprised, 0.4 * (celebrateBurst.current / 1.2));
//     }

//     // Micro-expression smile twitch in IDLE/FOCUS
//     microTimer.current += dt;
//     if (microActive.current > 0) {
//       microActive.current = Math.max(0, microActive.current - dt);
//       if (state === "IDLE" || state === "FOCUS") tHappy += 0.1;
//     } else if (microTimer.current >= nextMicro.current) {
//       microTimer.current = 0;
//       nextMicro.current = 6 + Math.random() * 4;
//       if (state === "IDLE" || state === "FOCUS") microActive.current = 0.8;
//     }

//     // Damped blend toward targets
//     const damp = 2.5;
//     safeSet(
//       vrm,
//       VRMExpressionPresetName.Happy,
//       THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Happy), tHappy, damp, dt),
//     );
//     safeSet(
//       vrm,
//       VRMExpressionPresetName.Angry,
//       THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Angry), tAngry, damp, dt),
//     );
//     safeSet(
//       vrm,
//       VRMExpressionPresetName.Sad,
//       THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Sad), tSad, damp, dt),
//     );
//     safeSet(
//       vrm,
//       VRMExpressionPresetName.Relaxed,
//       THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Relaxed), tRelaxed, damp, dt),
//     );
//     safeSet(
//       vrm,
//       VRMExpressionPresetName.Neutral,
//       THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Neutral), tNeutral, damp, dt),
//     );
//     safeSet(
//       vrm,
//       VRMExpressionPresetName.Surprised,
//       THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Surprised), tSurprised, damp, dt),
//     );

//     // Blink (with occasional double-blink)
//     blinkTimer.current += dt;
//     if (blinkTimer.current >= nextBlink.current) {
//       safeSet(vrm, VRMExpressionPresetName.Blink, 1);
//       blinkTimer.current = 0;
//       if (doubleBlinkPending.current) {
//         doubleBlinkPending.current = false;
//         nextBlink.current = 0.18;
//       } else {
//         doubleBlinkPending.current = Math.random() < 0.1;
//         nextBlink.current = 2.5 + Math.random() * 4;
//       }
//     } else {
//       const cur = safeGet(vrm, VRMExpressionPresetName.Blink);
//       if (cur > 0) {
//         safeSet(vrm, VRMExpressionPresetName.Blink, THREE.MathUtils.damp(cur, 0, 12, dt));
//       }
//     }

//     // Multi-viseme lip-sync
//     if (isSpeaking && !isPausing) {
//       const aa = Math.max(0, Math.sin(t * 14)) * 0.4;
//       const ih = Math.max(0, Math.sin(t * 11 + 1.3)) * 0.25;
//       const ou = Math.max(0, Math.sin(t * 9 + 2.1)) * 0.2;
//       safeSet(vrm, VRMExpressionPresetName.Aa, aa);
//       safeSet(vrm, VRMExpressionPresetName.Ih, ih);
//       safeSet(vrm, VRMExpressionPresetName.Ou, ou);
//     } else {
//       safeSet(
//         vrm,
//         VRMExpressionPresetName.Aa,
//         THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Aa), 0, 10, dt),
//       );
//       safeSet(
//         vrm,
//         VRMExpressionPresetName.Ih,
//         THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Ih), 0, 10, dt),
//       );
//       safeSet(
//         vrm,
//         VRMExpressionPresetName.Ou,
//         THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Ou), 0, 10, dt),
//       );
//     }
//   });

//   return vrm ? <primitive object={vrm.scene} position={[0, -1.5, 0]} /> : null;
// }

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { VRMLoaderPlugin, VRM, VRMExpressionPresetName } from "@pixiv/three-vrm";
import type { LearningState } from "../../types";
import { retargetMixamo } from "@/types/retargetMixamo";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
  vrmUrl?: string;
}

// Map your LearningStates directly to the Mixamo FBX files in your public folder
const FBX_MAP: Record<LearningState, string> = {
  IDLE: "/models/idle.fbx",
  FOCUS: "/models/thinking.fbx",
  CHALLENGE: "/models/talking.fbx",
  CELEBRATE: "/models/clapping.fbx",
};

// Soft setter that only acts if the expression exists on this VRM
function safeSet(vrm: VRM | null, name: string, value: number) {
  if (!vrm) return;
  const mgr = vrm.expressionManager;
  if (!mgr || !mgr.getExpression(name)) return;
  mgr.setValue(name, value);
}

function safeGet(vrm: VRM | null, name: string): number {
  if (!vrm) return 0;
  const mgr = vrm.expressionManager;
  if (!mgr || !mgr.getExpression(name)) return 0;
  return mgr.getValue(name) ?? 0;
}

export function MentorModel({
  state,
  isSpeaking,
  isPausing = false,
  vrmUrl = "/models/mentor.vrm",
}: Props) {
  const [vrm, setVrm] = useState<VRM | null>(null);

  // Animation References
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const actions = useRef<Record<string, THREE.AnimationAction>>({});

  const blinkTimer = useRef(0);
  const nextBlink = useRef(3 + Math.random() * 3);
  const doubleBlinkPending = useRef(false);

  const microTimer = useRef(0);
  const nextMicro = useRef(6 + Math.random() * 4);
  const microActive = useRef(0);

  const celebrateBurst = useRef(0);
  const prevState = useRef<LearningState>(state);

  // 1. Load VRM and FBX Animations concurrently
  useEffect(() => {
    let disposed = false;

    const gltfLoader = new GLTFLoader();
    gltfLoader.register((parser) => new VRMLoaderPlugin(parser));
    const fbxLoader = new FBXLoader();

    Promise.all([
      gltfLoader.loadAsync(vrmUrl),
      fbxLoader.loadAsync(FBX_MAP.IDLE),
      fbxLoader.loadAsync(FBX_MAP.FOCUS),
      fbxLoader.loadAsync(FBX_MAP.CHALLENGE),
      fbxLoader.loadAsync(FBX_MAP.CELEBRATE),
    ])
      .then(([gltf, idle, focus, challenge, celebrate]) => {
        if (disposed) return;

        const loadedVrm = gltf.userData.vrm as VRM;

        // VRMs often face backward when standard animations are applied.
        // If your character faces away from the camera, change 0 to Math.PI
        loadedVrm.scene.rotation.y = Math.PI / 180;

        loadedVrm.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) obj.frustumCulled = false;
        });

        setVrm(loadedVrm);

        // Initialize Animation Mixer
        const newMixer = new THREE.AnimationMixer(loadedVrm.scene);
        mixer.current = newMixer;

        // Pass the third argument (the loaded fbx group) into the function!
        const idleAnim = idle.animations[0];
        if (idleAnim) {
          const idleClip = retargetMixamo(idleAnim, loadedVrm, idle);
          if (idleClip) actions.current["IDLE"] = newMixer.clipAction(idleClip);
        }

        const focusAnim = focus.animations[0];
        if (focusAnim) {
          const focusClip = retargetMixamo(focusAnim, loadedVrm, focus);
          if (focusClip) actions.current["FOCUS"] = newMixer.clipAction(focusClip);
        }

        const challengeAnim = challenge.animations[0];
        if (challengeAnim) {
          const challengeClip = retargetMixamo(challengeAnim, loadedVrm, challenge);
          if (challengeClip) actions.current["CHALLENGE"] = newMixer.clipAction(challengeClip);
        }

        const celebrateAnim = celebrate.animations[0];
        if (celebrateAnim) {
          const celebrateClip = retargetMixamo(celebrateAnim, loadedVrm, celebrate);
          if (celebrateClip) actions.current["CELEBRATE"] = newMixer.clipAction(celebrateClip);
        }

        // Play the initial animation
        if (actions.current[state]) {
          actions.current[state].play();
        }
      })
      .catch((err) => console.error("Failed to load assets:", err));

    return () => {
      disposed = true;
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, [vrmUrl]); // Removed `state` from dependency array so it only loads once

  // 2. Handle State Changes (Crossfading Animations)
  useEffect(() => {
    if (!mixer.current || Object.keys(actions.current).length === 0) return;

    const nextAction = actions.current[state];

    // Trigger CELEBRATE facial burst
    if (prevState.current !== state) {
      if (state === "CELEBRATE") celebrateBurst.current = 1.2;
      prevState.current = state;
    }

    if (nextAction) {
      Object.values(actions.current).forEach((action) => {
        if (action !== nextAction) {
          action.fadeOut(0.5);
        }
      });
      nextAction.reset().fadeIn(0.5).play();
    }
  }, [state]);

  // 3. Render Loop (Update Mixer and Facial Expressions)
  useFrame((_, dt) => {
    const t = performance.now() / 1000;

    // Update body animation mixer
    if (mixer.current) {
      mixer.current.update(dt);
    }

    // ---------- EMOTIONS & FACIAL EXPRESSIONS ----------
    if (!vrm) return;

    vrm.update(dt);
    const mgr = vrm.expressionManager;
    if (!mgr) return;

    // Target weights per state
    let tHappy = 0;
    let tAngry = 0;
    let tSad = 0;
    let tRelaxed = 0;
    let tNeutral = 0;
    let tSurprised = 0;

    if (state === "IDLE") {
      tRelaxed = 0.25;
      tHappy = 0.1;
    } else if (state === "FOCUS") {
      tRelaxed = 0.4;
      tHappy = 0.15;
    } else if (state === "CHALLENGE") {
      if (isPausing) {
        tSad = 0.15;
        tRelaxed = 0.2;
        tAngry = 0.01;
      } else {
        tNeutral = 0.3;
        tHappy = 0.1;
      }
    } else if (state === "CELEBRATE") {
      tHappy = 0.8;
      tRelaxed = 0.3;
    }

    // Celebrate gasp burst
    if (celebrateBurst.current > 0) {
      celebrateBurst.current = Math.max(0, celebrateBurst.current - dt);
      tSurprised = Math.max(tSurprised, 0.4 * (celebrateBurst.current / 1.2));
    }

    // Micro-expression smile twitch
    microTimer.current += dt;
    if (microActive.current > 0) {
      microActive.current = Math.max(0, microActive.current - dt);
      if (state === "IDLE" || state === "FOCUS") tHappy += 0.1;
    } else if (microTimer.current >= nextMicro.current) {
      microTimer.current = 0;
      nextMicro.current = 6 + Math.random() * 4;
      if (state === "IDLE" || state === "FOCUS") microActive.current = 0.8;
    }

    // Damped blend toward targets
    const damp = 2.5;
    safeSet(
      vrm,
      VRMExpressionPresetName.Happy,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Happy), tHappy, damp, dt),
    );
    safeSet(
      vrm,
      VRMExpressionPresetName.Angry,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Angry), tAngry, damp, dt),
    );
    safeSet(
      vrm,
      VRMExpressionPresetName.Sad,
      THREE.MathUtils.damp(safeGet(vrm, VRMExpressionPresetName.Sad), tSad, damp, dt),
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

    // Blink
    blinkTimer.current += dt;
    if (blinkTimer.current >= nextBlink.current) {
      safeSet(vrm, VRMExpressionPresetName.Blink, 1);
      blinkTimer.current = 0;
      if (doubleBlinkPending.current) {
        doubleBlinkPending.current = false;
        nextBlink.current = 0.18;
      } else {
        doubleBlinkPending.current = Math.random() < 0.1;
        nextBlink.current = 2.5 + Math.random() * 4;
      }
    } else {
      const cur = safeGet(vrm, VRMExpressionPresetName.Blink);
      if (cur > 0) {
        safeSet(vrm, VRMExpressionPresetName.Blink, THREE.MathUtils.damp(cur, 0, 12, dt));
      }
    }

    // Multi-viseme lip-sync
    if (isSpeaking && !isPausing) {
      const aa = Math.max(0, Math.sin(t * 14)) * 0.4;
      const ih = Math.max(0, Math.sin(t * 11 + 1.3)) * 0.25;
      const ou = Math.max(0, Math.sin(t * 9 + 2.1)) * 0.2;
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

  return vrm ? <primitive object={vrm.scene} position={[0, -1.58, -0.3]} /> : null;
}
