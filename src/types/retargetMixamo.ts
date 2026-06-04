import * as THREE from "three";
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";

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
  fbxGroup: THREE.Group,
): THREE.AnimationClip | null {
  const tracks: THREE.KeyframeTrack[] = [];

  // Calculate world matrices to measure the resting bone angles
  fbxGroup.updateMatrixWorld(true);

  clip.tracks.forEach((track) => {
    const trackSplits = track.name.split(".");
    const mixamoBoneName = trackSplits[0];
    const propertyName = trackSplits[1];

    const vrmBoneName = mixamoVRMRigMap[mixamoBoneName] as VRMHumanBoneName;
    if (!vrmBoneName) return;

    const vrmNode = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName);
    const mixamoNode = fbxGroup.getObjectByName(mixamoBoneName);

    if (vrmNode && mixamoNode) {
      // --------------------------------------------------------
      // CRITICAL FIX: HIPS POSITION SCALING (Weight Shifting)
      // --------------------------------------------------------
      if (propertyName === "position") {
        if (mixamoBoneName === "mixamorigHips") {
          // Calculate the scale difference between the FBX skeleton and VRM skeleton
          const mixamoY = mixamoNode.position.y;
          const vrmY = vrmNode.position.y;
          const scaleFactor = mixamoY !== 0 ? vrmY / mixamoY : 1;

          const values = [...track.values];
          for (let i = 0; i < values.length; i++) {
            values[i] = values[i] * scaleFactor;
          }

          tracks.push(
            new THREE.VectorKeyframeTrack(`${vrmNode.name}.position`, track.times, values),
          );
        }
        return; // Reject all other position tracks to prevent limb tearing
      }

      // --------------------------------------------------------
      // QUATERNION RETARGETING (Rotational Math)
      // --------------------------------------------------------
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
