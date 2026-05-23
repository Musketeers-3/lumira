import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "lumira-mentor-settings";

export interface MentorSettings {
  warmth: number; // 0–100, higher = gentler light/morph
  motion: number; // 0–100, higher = more animation
  voice: boolean;
}

const DEFAULTS: MentorSettings = {
  warmth: 60,
  motion: 70,
  voice: true,
};

function loadSettings(): MentorSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<MentorSettings>;
    return {
      warmth: parsed.warmth ?? DEFAULTS.warmth,
      motion: parsed.motion ?? DEFAULTS.motion,
      voice: parsed.voice ?? DEFAULTS.voice,
    };
  } catch {
    return DEFAULTS;
  }
}

interface Ctx extends MentorSettings {
  setWarmth: (v: number) => void;
  setMotion: (v: number) => void;
  setVoice: (v: boolean) => void;
  /** 0.4–2.0 crossfade duration multiplier */
  motionMultiplier: number;
  /** 0–1 warmth bias for lights/morphs */
  warmthBias: number;
  reducedMotion: boolean;
}

export const MentorSettingsContext = createContext<Ctx | null>(null);

export function MentorSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MentorSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setWarmth = useCallback((warmth: number) => {
    setSettings((s) => ({ ...s, warmth }));
  }, []);

  const setMotion = useCallback((motion: number) => {
    setSettings((s) => ({ ...s, motion }));
  }, []);

  const setVoice = useCallback((voice: boolean) => {
    setSettings((s) => ({ ...s, voice }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...settings,
      setWarmth,
      setMotion,
      setVoice,
      motionMultiplier: 0.4 + (settings.motion / 100) * 1.6,
      warmthBias: settings.warmth / 100,
      reducedMotion: settings.motion < 30,
    }),
    [settings, setWarmth, setMotion, setVoice],
  );

  return <MentorSettingsContext.Provider value={value}>{children}</MentorSettingsContext.Provider>;
}
