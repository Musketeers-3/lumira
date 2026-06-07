import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { View, Environment } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import * as THREE from "three";
import type { LearningState } from "../types";
import type { RealmId } from "@/lib/realms";
import type { Artifact } from "@/lib/artifacts";

import { Waveform } from "./Waveform";
import { MentorScene } from "./MentorStage3D";
import { WorldScene } from "./WorldStage3D";
import { SCENE_SPLIT } from "./mentor3d/mentorLayout";

// Vite hot-reload protection
if (import.meta.hot) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta.hot as any).decline?.();
}

interface Props {
  state: LearningState;
  isSpeaking: boolean;
  isPausing?: boolean;
  realm?: RealmId;
  artifacts?: Artifact[];
  lookTarget?: [number, number, number] | null;
  onObjectInteract?: (label: string, hint: string) => void;
}

// 1. EXTRACTED GL CONFIG: Prevents React from rebuilding the WebGL context on re-renders.
const GL_CONFIG = {
  antialias: false,
  alpha: true,
  powerPreference: "high-performance" as const,
  toneMapping: ACESFilmicToneMapping,
};

// NOTE: CanvasGarbageCollector has been completely removed to prevent self-destruction.

export function MentorCanvas({
  state,
  isSpeaking,
  isPausing = false,
  realm = "physics",
  artifacts = [],
  lookTarget = null,
  onObjectInteract,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const mentorContainer = useRef<HTMLDivElement>(null!);
  const worldContainer = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#05050A]">
      {/* Left 30% Panel — Mentor DOM Track */}
      <div
        ref={mentorContainer}
        className="relative h-full shrink-0"
        style={{
          width: `${SCENE_SPLIT.mentorPercent}%`,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-3">
          <Waveform active={isSpeaking && !isPausing} />
        </div>
      </div>

      {/* Right 70% Panel — Learning World DOM Track */}
      <div
        ref={worldContainer}
        className="relative h-full flex-1"
        style={{ width: `${SCENE_SPLIT.worldPercent}%` }}
      />

      {/* SINGLE MASTER WEBGL CANVAS */}
      {mounted && (
        <Canvas
          className="pointer-events-none absolute inset-0 z-0"
          eventSource={
            typeof document !== "undefined"
              ? document.getElementById("root") || document.body
              : undefined
          }
          dpr={1}
          gl={GL_CONFIG} // 2. APPLIED STABLE GL CONFIG HERE
        >
          {/* 3. SUSPENSE BOUNDARY ADDED AROUND ENVIRONMENT */}
          <Suspense fallback={null}>
            <Environment preset="night" />
          </Suspense>

          {/* Mentor Projection Viewport */}
          <View track={mentorContainer}>
            <MentorScene
              state={state}
              isSpeaking={isSpeaking}
              isPausing={isPausing}
              lookTarget={lookTarget}
            />
          </View>

          {/* World Projection Viewport */}
          <View track={worldContainer}>
            <Suspense fallback={null}>
              <WorldScene
                state={state}
                realm={realm}
                artifacts={artifacts}
                onObjectInteract={onObjectInteract}
              />
            </Suspense>
          </View>
        </Canvas>
      )}
    </div>
  );
}
