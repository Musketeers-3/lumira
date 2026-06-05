import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD_STAGE } from "./mentorLayout";

const _lookAt = new THREE.Vector3(...WORLD_STAGE.cameraLookAt);

export function WorldStageCamera() {
  const { camera } = useThree();
  const initialized = useRef(false);

  useFrame(() => {
    if (!initialized.current) {
      camera.position.set(...WORLD_STAGE.cameraPosition);
      initialized.current = true;
    }
    camera.lookAt(_lookAt);
  });

  return null;
}
