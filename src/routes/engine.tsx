import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SocraticEngine } from "@/components/socratic/engine/SocraticEngine";

// 1. Define a strict search parameter schema to dynamically load any lesson
const engineSearchSchema = z.object({
  lessonId: z.string().optional().default("moon-orbit-demo"),
  topic: z.string().optional().default("Newtonian Gravity & Orbits"),
  objective: z
    .string()
    .optional()
    .default("Discover that an orbit is continuous falling combined with sideways motion."),
  realm: z
    .enum(["hub", "physics", "chemistry", "biology", "math", "history"])
    .optional()
    .default("physics"),
});

export const Route = createFileRoute("/engine")({
  validateSearch: engineSearchSchema,
  head: () => ({
    meta: [
      { title: "Exploration — Lumira" },
      {
        name: "description",
        content:
          "Step into a living world. Explore, reason, and discover understanding beside your mentor.",
      },
    ],
  }),
  component: EnginePage,
});

function EnginePage() {
  // 2. Extract the dynamic parameters from the URL
  const search = Route.useSearch();

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in duration-700">
      <SocraticEngine
        enableAI={true}
        enablePersistence={true}
        lessonId={search.lessonId}
        topic={search.topic}
        learningObjective={search.objective}
        realm={search.realm}
      />
    </div>
  );
}
