import * as THREE from "three";
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";

/**
 * Mixamo → VRM humanoid normalized bone map.
 * Follows @pixiv/three-vrm humanoid retargeting conventions:
 * only hips translation is kept; all other bones use quaternion rotation tracks.
 */
const MIXAMO_TO_VRM: Record<string, VRMHumanBoneName> = {
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

function normalizeMixamoBoneName(raw: string): string {
  return raw.replace(/^mixamorig:/i, "mixamorig");
}

const _parentWorldQuat = new THREE.Quaternion();
const _boneWorldQuat = new THREE.Quaternion();
const _restWorldQuat = new THREE.Quaternion();
const _quat = new THREE.Quaternion();
// small procedural pose adjustments are applied inside the retarget function
/**
 * Retarget a Mixamo FBX clip onto a VRM humanoid skeleton.
 * Returns a clip bound to normalized VRM bone node names.
 */
export function retargetFbxToVrm(
  clip: THREE.AnimationClip,
  vrm: VRM,
  fbxRoot: THREE.Object3D,
  clipName: string,
): THREE.AnimationClip | null {
  if (!vrm.humanoid) return null;

  // apply small corrective rotation to forearms to match Mixamo T-pose variants
  const leftUpperArm = vrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
  const rightUpperArm = vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");

  const leftLowerArm = vrm.humanoid?.getNormalizedBoneNode("leftLowerArm");
  const rightLowerArm = vrm.humanoid?.getNormalizedBoneNode("rightLowerArm");

  if (leftUpperArm) {
    leftUpperArm.rotation.z = -1.2;
  }

  if (rightUpperArm) {
    rightUpperArm.rotation.z = 1.2;
  }

  if (leftLowerArm) {
    leftLowerArm.rotation.z = -0.15;
  }

  if (rightLowerArm) {
    rightLowerArm.rotation.z = 0.15;
  }

  fbxRoot.updateMatrixWorld(true);
  const tracks: THREE.KeyframeTrack[] = [];

  for (const track of clip.tracks) {
    const [rawBone, property] = track.name.split(".");
    if (!property) continue;

    const mixamoBone = normalizeMixamoBoneName(rawBone);
    const vrmBoneName = MIXAMO_TO_VRM[mixamoBone];
    if (!vrmBoneName) continue;

    const vrmNode = vrm.humanoid.getNormalizedBoneNode(vrmBoneName);
    const mixamoNode = fbxRoot.getObjectByName(mixamoBone) ?? fbxRoot.getObjectByName(rawBone);
    if (!vrmNode || !mixamoNode) continue;

    if (property === "position") {
      if (mixamoBone !== "mixamorigHips") continue;

      const mixamoY = mixamoNode.position.y;
      const vrmY = vrmNode.position.y;
      const scale = mixamoY !== 0 ? vrmY / mixamoY : 1;
      const values = Array.from(track.values, (v) => v * scale);

      tracks.push(new THREE.VectorKeyframeTrack(`${vrmNode.name}.position`, track.times, values));
      continue;
    }

    if (property !== "quaternion") continue;

    mixamoNode.getWorldQuaternion(_boneWorldQuat);
    if (mixamoNode.parent) {
      mixamoNode.parent.getWorldQuaternion(_parentWorldQuat);
    } else {
      _parentWorldQuat.identity();
    }
    _restWorldQuat.copy(_boneWorldQuat).invert();

    const values = new Float32Array(track.values.length);
    for (let i = 0; i < track.values.length; i += 4) {
      _quat.fromArray(track.values, i);
      _quat.premultiply(_parentWorldQuat).multiply(_restWorldQuat);
      _quat.toArray(values, i);
    }

    tracks.push(
      new THREE.QuaternionKeyframeTrack(`${vrmNode.name}.quaternion`, track.times, values),
    );
  }

  if (tracks.length === 0) return null;
  return new THREE.AnimationClip(clipName, clip.duration, tracks);
}

/** @deprecated Use retargetFbxToVrm */
export function retargetMixamo(
  clip: THREE.AnimationClip,
  vrm: VRM,
  fbxGroup: THREE.Group,
): THREE.AnimationClip | null {
  return retargetFbxToVrm(clip, vrm, fbxGroup, clip.name);
}
