import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/architecture-log")({
  head: () => ({
    meta: [
      { title: "Journey Log — Lumira" },
      { name: "description", content: "A quiet record of every walk you and your mentor have taken together." },
      { property: "og:title", content: "Journey Log — Lumira" },
      { property: "og:description", content: "A quiet record of every walk you and your mentor have taken together." },
    ],
  }),
  component: ArchitectureLog,
});

const sessions = [
  { date: "May 21, 2026", time: "19:42", lesson: "Why Doesn't the Moon Fall to Earth?", intents: ["Gentle Push x3", "Believing Challenge x2", "Light Found"], excerpt: '"The Earth curves away from it… so the ball keeps falling, but the ground keeps dropping away too."' },
  { date: "May 18, 2026", time: "21:08", lesson: "Why Does a Balloon Squish When You Squeeze It?", intents: ["Gentle Push x4", "Believing Challenge x1", "Light Found"], excerpt: '"Oh — air is made of tiny things, and they\'re all pushing back on the inside."' },
  { date: "May 14, 2026", time: "08:33", lesson: "Why Is the Sky Blue and the Sunset Red?", intents: ["Gentle Push x5", "Believing Challenge x3"], excerpt: '"The blue light is being scattered more than the red — it bounces around the sky."' },
  { date: "May 09, 2026", time: "22:11", lesson: "Why Does Ice Float Instead of Sinking?", intents: ["Gentle Push x2", "Light Found"], excerpt: '"Water is weird — when it freezes, the molecules spread out instead of packing tighter."' },
];

function ArchitectureLog() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <div
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: "var(--gold-soft)" }}
        >
          the walks you've taken
        </div>
        <h1
          className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl"
          style={{ color: "var(--ink-primary)" }}
        >
          Journey Log
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: "var(--ink-secondary)" }}>
          Every session you've shared, the shape of the conversation, and the moment you found
          your light.
        </p>
      </header>

      <div className="relative pl-8">
        <div
          className="absolute left-3 top-2 bottom-2 w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(201,162,75,0.6), rgba(201,162,75,0.15) 60%, transparent)",
            boxShadow: "0 0 12px rgba(201,162,75,0.25)",
          }}
        />
        <div className="space-y-5">
          {sessions.map((s, i) => (
            <div key={i} className="relative">
              <span
                className="absolute -left-[22px] top-5 h-2.5 w-2.5 rounded-full"
                style={{
                  background: "var(--gold-soft)",
                  boxShadow: "0 0 12px rgba(201,162,75,0.7), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              />
              <div
                className="surface-luxe p-5 transition-all duration-500 hover:-translate-y-0.5"
                style={{ borderLeft: "2px solid var(--state-accent)" }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3
                    className="text-lg font-semibold tracking-tight"
                    style={{ color: "var(--ink-primary)" }}
                  >
                    {s.lesson}
                  </h3>
                  <div
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "var(--gold-soft)" }}
                  >
                    {s.date} · {s.time}
                  </div>
                </div>
                <p
                  className="mt-2 text-sm italic"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  {s.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.intents.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
                      style={{
                        background: "rgba(201,162,75,0.06)",
                        border: "1px solid rgba(201,162,75,0.22)",
                        color: "var(--gold-soft)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
