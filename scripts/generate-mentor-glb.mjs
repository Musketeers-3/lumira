/**
 * Generates public/models/mentor/lumira.glb — interim rigged mentor asset.
 * Run: bun run scripts/generate-mentor-glb.mjs
 */
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import fs from "fs";

// GLTFExporter binary path expects FileReader (browser API)
globalThis.FileReader = class FileReader {
  result = null;
  onloadend = null;
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.onloadend?.({ target: this });
    });
  }
};
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/models/mentor");
const OUT_FILE = path.join(OUT_DIR, "lumira.glb");

const SKIN = 0xf2cda0;
const COAT = 0x3d4f5c;
const HAIR = 0x1a0e0a;

function makeClip(name, duration, tracks) {
  return new THREE.AnimationClip(name, duration, tracks);
}

function boneTrack(bone, times, values, prop) {
  return new THREE.VectorKeyframeTrack(`${bone.name}.${prop}`, times, values);
}

function quatTrack(bone, times, values) {
  return new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, times, values);
}

function buildRig() {
  const root = new THREE.Bone();
  root.name = "Root";

  const spine = new THREE.Bone();
  spine.name = "Spine";
  spine.position.set(0, 0.55, 0);

  const chest = new THREE.Bone();
  chest.name = "Chest";
  chest.position.set(0, 0.35, 0);

  const head = new THREE.Bone();
  head.name = "Head";
  head.position.set(0, 0.38, 0);

  root.add(spine);
  spine.add(chest);
  chest.add(head);

  const skinMat = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.75 });
  const coatMat = new THREE.MeshStandardMaterial({ color: COAT, roughness: 0.85 });
  const hairMat = new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.95 });

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 0.9, 12), coatMat);
  torso.position.set(0, 0.45, 0);
  spine.add(torso);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), skinMat);
  headMesh.name = "HeadMesh";
  headMesh.position.set(0, 0.2, 0.08);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8),
    hairMat,
  );
  hair.position.set(0, 0.08, -0.02);
  headMesh.add(hair);

  // Morph targets for expressions
  headMesh.geometry.morphAttributes.position = [];
  headMesh.morphTargetInfluences = [];
  const basePos = headMesh.geometry.attributes.position.array.slice();
  const morph = (name, offsetFn) => {
    const arr = basePos.slice();
    const pos = new THREE.Vector3();
    for (let i = 0; i < arr.length; i += 3) {
      pos.set(arr[i], arr[i + 1], arr[i + 2]);
      offsetFn(pos, i / 3);
      arr[i] = pos.x;
      arr[i + 1] = pos.y;
      arr[i + 2] = pos.z;
    }
    headMesh.geometry.morphAttributes.position.push(new THREE.Float32BufferAttribute(arr, 3));
    return name;
  };

  const morphNames = [];
  morphNames.push(
    morph("attentive", (p) => {
      if (p.z > 0.2) p.y += 0.008;
    }),
  );
  morphNames.push(
    morph("thoughtful", (p) => {
      if (p.y > 0) p.x *= 0.98;
      if (p.z > 0.15) p.y -= 0.006;
    }),
  );
  morphNames.push(
    morph("encouraging", (p) => {
      if (p.z > 0.2 && p.y < 0) p.y += 0.01;
    }),
  );
  morphNames.push(
    morph("quiet_pride", (p) => {
      if (p.z > 0.2) p.y += 0.005;
    }),
  );
  morphNames.push(
    morph("blink", (p) => {
      if (p.y > -0.02 && p.y < 0.08 && p.z > 0.22) p.y -= 0.04;
    }),
  );

  headMesh.morphTargetDictionary = Object.fromEntries(morphNames.map((n, i) => [n, i]));
  headMesh.morphTargetInfluences = morphNames.map(() => 0);

  head.add(headMesh);

  const group = new THREE.Group();
  group.name = "LumiraMentor";
  group.add(root);

  return { group, root, spine, chest, head, headMesh, morphNames };
}

function createAnimations(bones) {
  const { root, spine, chest, head } = bones;
  const clips = [];

  // idle_breathe — 4s
  {
    const t = [0, 1, 2, 3, 4];
    const spineY = t.flatMap((ti) => [0.55, 0.55 + Math.sin(ti * Math.PI * 0.5) * 0.02, 0.55]);
    const headQ = t.flatMap((ti) => {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.sin(ti * 0.8) * 0.02, 0, 0),
      );
      return [q.x, q.y, q.z, q.w];
    });
    clips.push(
      makeClip("idle_breathe", 4, [
        boneTrack(spine, t, spineY.slice(0, t.length * 3), "position"),
        quatTrack(head, t, headQ),
      ]),
    );
  }

  // focus_listen — lean forward
  {
    const t = [0, 1.5, 3];
    const rootRx = t.flatMap(() => {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.08, 0, 0));
      return [q.x, q.y, q.z, q.w];
    });
    clips.push(makeClip("focus_listen", 3, [quatTrack(root, t, rootRx)]));
  }

  // challenge_present — upright still
  {
    const t = [0, 1.5, 3];
    const headRx = t.flatMap(() => {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05, 0, 0));
      return [q.x, q.y, q.z, q.w];
    });
    clips.push(makeClip("challenge_present", 3, [quatTrack(head, t, headRx)]));
  }

  // celebrate_quiet — soft nod
  {
    const t = [0, 0.8, 1.6, 2.4, 3];
    const headRx = t.flatMap((ti) => {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.sin(ti * 1.2) * 0.06 + 0.04, 0, 0),
      );
      return [q.x, q.y, q.z, q.w];
    });
    clips.push(makeClip("celebrate_quiet", 3, [quatTrack(head, t, headRx)]));
  }

  // speak_add — micro motion
  {
    const t = [0, 0.5, 1, 1.5, 2];
    const chestY = t.flatMap((ti) => [0.35, 0.35 + Math.sin(ti * 8) * 0.008, 0.35]);
    clips.push(
      makeClip("speak_add", 2, [boneTrack(chest, t, chestY.slice(0, t.length * 3), "position")]),
    );
  }

  return clips;
}

async function main() {
  const rig = buildRig();
  const clips = createAnimations(rig);

  const exporter = new GLTFExporter();
  const glb = await new Promise((resolve, reject) => {
    exporter.parse(
      rig.group,
      (result) => resolve(result),
      (err) => reject(err),
      { binary: true, animations: clips, truncateDrawRange: true },
    );
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, Buffer.from(glb));
  console.log(`Wrote ${OUT_FILE} (${fs.statSync(OUT_FILE).size} bytes)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
