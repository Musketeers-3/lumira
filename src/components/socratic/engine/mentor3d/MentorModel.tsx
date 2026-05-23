import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM, VRMExpressionPresetName } from "@pixiv/three-vrm";
import type { LearningState } from "../../types";

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
  vrmUrl?: string;
}

export function MentorModel({
  state,
  isSpeaking,
  isPausing = false,
  vrmUrl = "/models/mentor.vrm",
}: Props) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const neckBoneRef = useRef<THREE.Object3D | null>(null);
  const blinkTimer = useRef(0);
  const nextBlink = useRef(3 + Math.random() * 3);

  // 1. Load and Parse the VRM File
  useEffect(() => {
    const loader = new GLTFLoader();

    // Clean TypeScript registration using the core three.js GLTFLoader
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });

    loader.load(
      vrmUrl,
      (gltf) => {
        const loadedVrm = gltf.userData.vrm as VRM;
        setVrm(loadedVrm);

        // VRM models usually load facing backwards. Rotate to face the camera.
        loadedVrm.scene.rotation.y = 0;

        // Extract bones for procedural animation
        headBoneRef.current = loadedVrm.humanoid?.getNormalizedBoneNode("head") || null;
        neckBoneRef.current = loadedVrm.humanoid?.getNormalizedBoneNode("neck") || null;

        // Drop his arms down to his sides naturally
        const leftUpperArm = loadedVrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
        const rightUpperArm = loadedVrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
        if (leftUpperArm) leftUpperArm.rotation.z = -1.2;
        if (rightUpperArm) rightUpperArm.rotation.z = 1.2;

        // Disable frustum culling to prevent the model from disappearing during animations
        loadedVrm.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            obj.frustumCulled = false;
          }
        });
      },
      (progress) => {
        // Optional loading progress hook
      },
      (error) => console.error("Failed to load VRM:", error),
    );

    return () => {
      // Memory cleanup on unmount
      if (vrm) {
        vrm.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [vrmUrl]);

  // 2. The Procedural Life Engine (Runs every frame)
  useFrame((_, dt) => {
    if (!vrm) return;
    const t = performance.now() / 1000;

    // Update VRM internal physics (hair/clothes swinging)
    vrm.update(dt);

    const expressions = vrm.expressionManager;
    if (!expressions) return;

    // Procedural Blinking
    blinkTimer.current += dt;
    if (blinkTimer.current >= nextBlink.current) {
      expressions.setValue(VRMExpressionPresetName.Blink, 1);
      blinkTimer.current = 0;
      nextBlink.current = 2.5 + Math.random() * 4;
    } else {
      const currentBlink = expressions.getValue(VRMExpressionPresetName.Blink) || 0;
      if (currentBlink > 0) {
        expressions.setValue(
          VRMExpressionPresetName.Blink,
          THREE.MathUtils.damp(currentBlink, 0, 12, dt),
        );
      }
    }

    // Emotional State Mapping (Reset baseline first)
    expressions.setValue(VRMExpressionPresetName.Happy, 0);
    expressions.setValue(VRMExpressionPresetName.Angry, 0);
    expressions.setValue(VRMExpressionPresetName.Relaxed, 0);
    expressions.setValue(VRMExpressionPresetName.Sad, 0);

    if (state === "FOCUS") {
      expressions.setValue(VRMExpressionPresetName.Relaxed, 0.4);
    } else if (state === "CHALLENGE") {
      if (isPausing) {
        expressions.setValue(VRMExpressionPresetName.Sad, 0.1);
      } else {
        expressions.setValue(VRMExpressionPresetName.Angry, 0.15);
      }
    } else if (state === "CELEBRATE") {
      expressions.setValue(VRMExpressionPresetName.Happy, 0.6);
    }

    // Procedural Speaking (Simulated Lip-sync)
    if (isSpeaking && !isPausing) {
      const mouthOpen = (Math.sin(t * 15) + 1) * 0.35;
      expressions.setValue(VRMExpressionPresetName.Aa, mouthOpen);
    } else {
      const currentAa = expressions.getValue(VRMExpressionPresetName.Aa) || 0;
      expressions.setValue(VRMExpressionPresetName.Aa, THREE.MathUtils.damp(currentAa, 0, 10, dt));
    }

    // Subconscious Movement (Breathing & Head Tracking)
    if (headBoneRef.current && neckBoneRef.current) {
      const breath = Math.sin(t * (state === "CHALLENGE" ? 1.5 : 1.0)) * 0.02;
      neckBoneRef.current.rotation.x = breath;

      const targetTilt = state === "CHALLENGE" ? -0.05 : state === "CELEBRATE" ? 0.05 : 0;
      headBoneRef.current.rotation.x = THREE.MathUtils.damp(
        headBoneRef.current.rotation.x,
        targetTilt,
        2,
        dt,
      );

      headBoneRef.current.rotation.y = Math.sin(t * 0.5) * 0.03;
      headBoneRef.current.rotation.z = Math.cos(t * 0.3) * 0.01;
    }
  });

  // Position adjusted to frame the anime character from the chest up
  return vrm ? <primitive object={vrm.scene} position={[0, -1.5, 0]} /> : null;
}
