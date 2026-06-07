// MentorStageCamera.tsx
import { PerspectiveCamera } from "@react-three/drei";
import { MENTOR_STAGE } from "./mentorLayout";

export function MentorStageCamera() {
  return (
    <PerspectiveCamera
      makeDefault // 👈 This tells the <View> to use THIS camera
      position={MENTOR_STAGE.cameraPosition}
      fov={MENTOR_STAGE.fov}
      onUpdate={(camera) => {
        // This safely fires when the camera mounts or props change
        camera.lookAt(...MENTOR_STAGE.cameraLookAt);
        camera.updateProjectionMatrix();
      }}
    />
  );
}
