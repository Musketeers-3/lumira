import { createFileRoute } from "@tanstack/react-router";
import { SocraticEngine } from "@/components/socratic/engine/SocraticEngine";

export const Route = createFileRoute("/engine")({
  head: () => ({
    meta: [
      { title: "The Dojo — Lumira" },
      {
        name: "description",
        content:
          "Step into the dojo. A patient mentor walks beside you while you reason your way to ideas.",
      },
      { property: "og:title", content: "The Dojo — Lumira" },
      {
        property: "og:description",
        content:
          "Step into the dojo. A patient mentor walks beside you while you reason your way to ideas.",
      },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl">
      <SocraticEngine />
    </div>
  ),
});
