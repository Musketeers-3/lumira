import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/architecture-log")({
  head: () => ({
    meta: [
      { title: "Journey Log — Lumira" },
      {
        name: "description",
        content: "A quiet record of every walk you and your mentor have taken together.",
      },
      { property: "og:title", content: "Journey Log — Lumira" },
      {
        property: "og:description",
        content: "A quiet record of every walk you and your mentor have taken together.",
      },
    ],
  }),
  component: ArchitectureLog,
});

const sessions = [
  {
    date: "May 21, 2026",
    time: "19:42",
    lesson: "Binary Search via the Dictionary Puzzle",
    intents: ["Gentle Push x3", "Believing Challenge x2", "Light Found"],
    excerpt: '"I... don\'t need them anymore. I can throw the whole second half away."',
  },
  {
    date: "May 18, 2026",
    time: "21:08",
    lesson: "Recursion via the Russian Doll",
    intents: ["Gentle Push x4", "Believing Challenge x1", "Light Found"],
    excerpt: '"Wait — the function is calling a smaller version of itself."',
  },
  {
    date: "May 14, 2026",
    time: "08:33",
    lesson: "Big-O — Why doubling input matters",
    intents: ["Gentle Push x5", "Believing Challenge x3"],
    excerpt: '"It scales with the input, not with the clock."',
  },
  {
    date: "May 09, 2026",
    time: "22:11",
    lesson: "Decomposition — Breaking the Sandwich",
    intents: ["Gentle Push x2", "Light Found"],
    excerpt: '"Every big problem is just smaller problems pretending."',
  },
];

function ArchitectureLog() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-state-accent transition-colors duration-700">
          the walks you've taken
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">Journey Log</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Every session you've shared, the shape of the conversation, and the moment you found your
          light.
        </p>
      </header>

      <div className="relative pl-8">
        <div
          className="absolute left-3 top-2 bottom-2 w-[1px] transition-colors duration-700"
          style={{ background: "linear-gradient(to bottom, var(--state-accent), transparent)" }}
        />
        <div className="space-y-5">
          {sessions.map((s, i) => (
            <div key={i} className="relative">
              <span
                className="absolute -left-[22px] top-5 h-2.5 w-2.5 rounded-full transition-colors duration-700"
                style={{
                  background: "var(--state-accent)",
                  boxShadow: "0 0 12px var(--state-glow)",
                }}
              />
              <div className="rounded-2xl border border-glass-border bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.06]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{s.lesson}</h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.date} · {s.time}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground italic">{s.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.intents.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-glass-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
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
