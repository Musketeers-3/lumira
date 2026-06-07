// src/routes/explore.tsx
import { SocraticEngine } from "@/components/socratic/engine/SocraticEngine";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Define the schema for the search parameters
const ExploreSearchSchema = z.object({
  realm: z.string().default("physics"), // Ensure realm is always a string
});

export const Route = createFileRoute("/explore")({
  validateSearch: ExploreSearchSchema,
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { realm } = Route.useSearch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <SocraticEngine realm={realm as any} />;
  },
});
