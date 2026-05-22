import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import type { LearningState } from '../types';
import { MentorModel } from './mentor3d/MentorModel';
import { MentorAvatar } from './MentorAvatar';

interface Props {
  state: LearningState;
  isSpeaking: boolean;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function Mentor3D({ state, isSpeaking }: Props) {
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(detectWebGL());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full" aria-hidden />;
  }

  if (!webgl) {
    // Graceful 2D fallback
    return (
      <div className="h-full w-full">
        <MentorAvatar state={state} isSpeaking={isSpeaking} />
      </div>
    );
  }

  // Rim/key light tone shifts with state via emissive hints in materials.
  const keyColor =
    state === 'CHALLENGE' ? '#ff6a4d'
    : state === 'CELEBRATE' ? '#ffd97a'
    : state === 'FOCUS' ? '#7fb3ff'
    : '#f4d9a8';

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.4, 2.7], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[2.2, 3, 2]}
        intensity={1.1}
        color={keyColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2.5, 1.5, -1]} intensity={0.45} color={keyColor} />
      <pointLight position={[0, 1.5, 2]} intensity={0.4} color="#fff2dc" />

      <MentorModel state={state} isSpeaking={isSpeaking} />

      <ContactShadows
        position={[0, -0.92, 0]}
        opacity={0.45}
        scale={4}
        blur={2.5}
        far={2}
      />
      <Environment preset="sunset" />
    </Canvas>
  );
}
