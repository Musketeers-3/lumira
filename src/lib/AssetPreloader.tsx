import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export function AssetPreloader() {
  useEffect(() => {
    // 1. Immediately cache the 3D table geometry using R3F's native preloader
    useGLTF.preload("/models/study-desk.glb");

    // 2. Silently background-fetch the massive VRM and FBX files into the browser's disk cache.
    // By the time the user opens the Dojo, the network request will take 0.01 seconds.
    const prefetch = (url: string) => {
      fetch(url, { priority: "low" }).catch(() => null);
    };

    prefetch("/models/mentor.vrm");
    prefetch("/models/idle.fbx");
    prefetch("/models/thinking.fbx");
    prefetch("/models/talking.fbx");
    prefetch("/models/clapping.fbx");
  }, []);

  return null;
}
