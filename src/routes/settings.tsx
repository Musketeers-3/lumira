import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLearningState } from "@/lib/learning-state-context";
import { useMentorSettings } from "@/lib/mentor-settings-hooks";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lumira" },
      { name: "description", content: "Tune the warmth, motion, and presence of your learning companion." },
      { property: "og:title", content: "Settings — Lumira" },
      { property: "og:description", content: "Tune the warmth, motion, and presence of your learning companion." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { setState } = useLearningState();
  const navigate = useNavigate();
  const { voice, warmth, motion, setVoice, setWarmth, setMotion } = useMentorSettings();
  const [preview, setPreview] = useState<"IDLE" | "FOCUS" | "CHALLENGE" | "CELEBRATE">("IDLE");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <div
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: "var(--gold-soft)" }}
        >
          lumira // preferences
        </div>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl"
          style={{ color: "#F5F1E6" }}
        >
          Settings
        </h1>
      </header>

      <section className="surface-luxe p-6">
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#F5F1E6" }}>
          Feel each state
        </h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(245,241,230,0.6)" }}>
          The whole environment shifts with your mentor's presence.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {(["IDLE", "FOCUS", "CHALLENGE", "CELEBRATE"] as const).map((s) => {
            const active = preview === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setPreview(s);
                  setState(s);
                }}
                className="rounded-xl px-3 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-500"
                style={{
                  background: active
                    ? "linear-gradient(180deg, rgba(201,162,75,0.18), rgba(20,20,30,0.4))"
                    : "linear-gradient(180deg, #1B1B28, #13131C)",
                  border: active
                    ? "1px solid var(--state-accent)"
                    : "1px solid rgba(245,241,230,0.07)",
                  color: active ? "var(--state-accent)" : "rgba(245,241,230,0.55)",
                  boxShadow: active
                    ? "0 0 24px var(--state-glow), inset 0 1px 0 rgba(255,255,255,0.06)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-luxe p-6">
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#F5F1E6" }}>
          Mentor voice
        </h2>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm" style={{ color: "rgba(245,241,230,0.6)" }}>
            A soft tone when the mentor speaks to you.
          </p>
          <button
            onClick={() => setVoice(!voice)}
            className="relative h-7 w-12 rounded-full transition-colors duration-500"
            style={{
              background: voice
                ? "linear-gradient(90deg, var(--gold-deep), var(--gold-soft))"
                : "rgba(245,241,230,0.10)",
              boxShadow: voice
                ? "0 0 16px rgba(201,162,75,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"
                : "inset 0 1px 2px rgba(0,0,0,0.5)",
            }}
            aria-pressed={voice}
          >
            <span
              className="absolute top-1 h-5 w-5 rounded-full transition-transform duration-300"
              style={{
                background: "#F5F1E6",
                transform: voice ? "translateX(22px)" : "translateX(4px)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            />
          </button>
        </div>
      </section>

      <section className="surface-luxe p-6">
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#F5F1E6" }}>
          Mentor warmth
        </h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(245,241,230,0.6)" }}>
          How softly they encourage you when you're stuck.
        </p>
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={100}
            value={warmth}
            onChange={(e) => setWarmth(Number(e.target.value))}
            className="w-full accent-[#C9A24B]"
          />
          <div
            className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(245,241,230,0.5)" }}
          >
            <span>direct</span>
            <span style={{ color: "var(--gold-soft)" }}>{warmth}%</span>
            <span>gentle</span>
          </div>
        </div>
      </section>

      <section className="surface-luxe p-6">
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#F5F1E6" }}>
          Motion intensity
        </h2>
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={100}
            value={motion}
            onChange={(e) => setMotion(Number(e.target.value))}
            className="w-full accent-[#C9A24B]"
          />
          <div
            className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(245,241,230,0.5)" }}
          >
            <span>still</span>
            <span style={{ color: "var(--gold-soft)" }}>{motion}%</span>
            <span>cinematic</span>
          </div>
        </div>
      </section>

      <section className="surface-luxe p-6">
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "#F5F1E6" }}>
          Walk it again
        </h2>
        <p className="mt-1 text-sm" style={{ color: "rgba(245,241,230,0.6)" }}>
          Replay the Dictionary Puzzle from the beginning.
        </p>
        <button
          onClick={() => {
            setState("IDLE");
            navigate({ to: "/engine" });
          }}
          className="btn-gold mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide"
        >
          Walk it again
        </button>
      </section>

      <p
        className="text-center font-mono text-[10px] uppercase tracking-[0.25em]"
        style={{ color: "rgba(245,241,230,0.35)" }}
      >
        Lumira // v0.1 // walking with you
      </p>
    </div>
  );
}
