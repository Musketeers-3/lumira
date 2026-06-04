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
});

export const Route = createFileRoute("/engine")({
  validateSearch: engineSearchSchema,
  head: () => ({
    meta: [
      { title: "The Dojo — Lumira" },
      {
        name: "description",
        content:
          "Step into the dojo. A patient mentor walks beside you while you reason your way to ideas.",
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
        enableAI={true} // Force the live Socratic loop
        enablePersistence={true} // Ensure the walks are saved to the Journey Log
        lessonId={search.lessonId}
        topic={search.topic}
        learningObjective={search.objective}
      />
    </div>
  );
}
