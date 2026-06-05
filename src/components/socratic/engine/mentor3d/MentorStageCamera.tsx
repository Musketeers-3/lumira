import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MENTOR_STAGE } from "./mentorLayout";

const _lookAt = new THREE.Vector3(...MENTOR_STAGE.cameraLookAt);

export function MentorStageCamera() {
  const { camera } = useThree();
  const initialized = useRef(false);

  useFrame(() => {
    if (!initialized.current) {
      camera.position.set(...MENTOR_STAGE.cameraPosition);
      initialized.current = true;
    }
    camera.lookAt(_lookAt);
  });

  return null;
}
