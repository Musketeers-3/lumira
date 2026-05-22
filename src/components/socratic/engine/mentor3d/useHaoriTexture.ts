import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Hand-painted checkered haori texture (green + black squares)
 * Generated at module level via canvas — no external assets.
 */
export function useHaoriTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    // base black
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, size, size);
    // green squares — deep mossy green
    const cell = size / 8;
    ctx.fillStyle = '#2d5a3d';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if ((x + y) % 2 === 0) {
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }
    // soft cloth grain
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 3);
    tex.anisotropy = 4;
    return tex;
  }, []);
}
