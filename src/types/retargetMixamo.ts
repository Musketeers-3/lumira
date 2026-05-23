import * as THREE from "three";
import type { VRM } from "@pixiv/three-vrm";

const mixamoVRMRigMap: Record<string, string> = {
  mixamorigHips: "hips",
  mixamorigSpine: "spine",
  mixamorigSpine1: "chest",
  mixamorigSpine2: "upperChest",
  mixamorigNeck: "neck",
  mixamorigHead: "head",
  mixamorigLeftShoulder: "leftShoulder",
  mixamorigLeftArm: "leftUpperArm",
  mixamorigLeftForeArm: "leftLowerArm",
  mixamorigLeftHand: "leftHand",
  mixamorigRightShoulder: "rightShoulder",
  mixamorigRightArm: "rightUpperArm",
  mixamorigRightForeArm: "rightLowerArm",
  mixamorigRightHand: "rightHand",
  mixamorigLeftUpLeg: "leftUpperLeg",
  mixamorigLeftLeg: "leftLowerLeg",
  mixamorigLeftFoot: "leftFoot",
  mixamorigLeftToeBase: "leftToes",
  mixamorigRightUpLeg: "rightUpperLeg",
  mixamorigRightLeg: "rightLowerLeg",
  mixamorigRightFoot: "rightFoot",
  mixamorigRightToeBase: "rightToes",
};

export function retargetMixamo(
  clip: THREE.AnimationClip,
  vrm: VRM,
  fbxGroup: THREE.Group, // We now require the original FBX group to measure its bones
): THREE.AnimationClip | null {
  const tracks: THREE.KeyframeTrack[] = [];

  // Calculate world matrices so we can measure the resting bone angles
  fbxGroup.updateMatrixWorld(true);

  clip.tracks.forEach((track) => {
    const trackSplits = track.name.split(".");
    const mixamoBoneName = trackSplits[0];
    const propertyName = trackSplits[1];

    const vrmBoneName = mixamoVRMRigMap[mixamoBoneName];
    if (!vrmBoneName) return;

    const vrmNode = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName as any);
    const mixamoNode = fbxGroup.getObjectByName(mixamoBoneName);

    if (vrmNode && mixamoNode) {
      // Ignore position tracks to prevent teleporting
      if (propertyName === "position") return;

      if (propertyName === "quaternion") {
        // Measure Mixamo's exact resting angle in 3D space
        const restWorldRotation = new THREE.Quaternion();
        mixamoNode.getWorldQuaternion(restWorldRotation);

        const parentRestWorldRotation = new THREE.Quaternion();
        if (mixamoNode.parent) {
          mixamoNode.parent.getWorldQuaternion(parentRestWorldRotation);
        }

        const restRotationInverse = restWorldRotation.clone().invert();

        const values = [...track.values]; // Copy animation data
        const _quat = new THREE.Quaternion();

        for (let i = 0; i < values.length; i += 4) {
          _quat.fromArray(track.values, i);

          // MATH MAGIC: Convert Mixamo's local rotation into VRM's normalized space
          _quat.premultiply(parentRestWorldRotation).multiply(restRotationInverse);

          _quat.toArray(values, i);
        }

        tracks.push(
          new THREE.QuaternionKeyframeTrack(`${vrmNode.name}.quaternion`, track.times, values),
        );
      }
    }
  });

  if (tracks.length === 0) return null;
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}
