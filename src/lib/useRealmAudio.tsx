import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { RealmId } from "./realms";

interface RealmAudioContextValue {
  muted: boolean;
  toggleMute: () => void;
  setRealm: (realm: RealmId) => void;
}

const RealmAudioContext = createContext<RealmAudioContextValue | null>(null);

/** Procedural ambient drone per realm using Web Audio API — no external files needed */
function createRealmDrone(
  ctx: AudioContext,
  realm: RealmId,
): { nodes: AudioNode[]; cleanup: () => void } {
  const master = ctx.createGain();
  master.gain.value = 0.04;
  master.connect(ctx.destination);

  const configs: Record<RealmId, { freq: number; detune: number }[]> = {
    hub: [
      { freq: 110, detune: 0 },
      { freq: 165, detune: 3 },
    ],
    physics: [
      { freq: 55, detune: 0 },
      { freq: 82.5, detune: -2 },
      { freq: 110, detune: 5 },
    ],
    chemistry: [
      { freq: 130, detune: 0 },
      { freq: 195, detune: 4 },
    ],
    biology: [
      { freq: 98, detune: 0 },
      { freq: 147, detune: -3 },
    ],
    math: [
      { freq: 73, detune: 0 },
      { freq: 146, detune: 7 },
    ],
    history: [
      { freq: 87, detune: 0 },
      { freq: 131, detune: 2 },
    ],
  };

  const nodes: AudioNode[] = [master];
  const oscillators: OscillatorNode[] = [];

  for (const { freq, detune } of configs[realm] ?? configs.hub) {
    const osc = ctx.createOscillator();
    osc.type = realm === "physics" ? "sine" : "triangle";
    osc.frequency.value = freq;
    osc.detune.value = detune;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.5 / (configs[realm]?.length ?? 2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start();

    nodes.push(osc, filter, gain);
    oscillators.push(osc);
  }

  return {
    nodes,
    cleanup: () =>
      oscillators.forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch {
          /* */
        }
      }),
  };
}

export function RealmAudioProvider({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const [muted, setMuted] = useState(true);
  const [realm, setRealmState] = useState<RealmId>("hub");
  const ctxRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const startAudio = useCallback(
    (r: RealmId) => {
      if (!enabled || muted) return;
      cleanupRef.current?.();
      cleanupRef.current = null;

      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const { cleanup } = createRealmDrone(ctx, r);
      cleanupRef.current = cleanup;
    },
    [enabled, muted],
  );

  useEffect(() => {
    if (muted) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      return;
    }
    startAudio(realm);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [realm, muted, startAudio]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const setRealm = useCallback((r: RealmId) => {
    setRealmState(r);
  }, []);

  return (
    <RealmAudioContext.Provider value={{ muted, toggleMute, setRealm }}>
      {children}
    </RealmAudioContext.Provider>
  );
}

export function useRealmAudio() {
  const ctx = useContext(RealmAudioContext);
  if (!ctx) {
    return { muted: true, toggleMute: () => {}, setRealm: () => {} };
  }
  return ctx;
}
