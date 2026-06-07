import { createFileRoute } from "@tanstack/react-router";
import { WorldGateways } from "@/components/socratic/gateways/WorldGateways";

export const Route = createFileRoute("/gateways")({
  head: () => ({
    meta: [
      { title: "Select a Realm — Lumira" },
      { name: "description", content: "Choose your next discovery." },
    ],
  }),
  component: WorldGateways,
});
