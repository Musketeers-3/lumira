import { useCallback } from "react";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { persistArtifact } from "@/lib/artifacts";
import type { DiscoveryPayload } from "@/lib/constellations";

export function useDiscoveryEngine() {
  const { updateSkill, markBreakthrough } = useSessionPersistence();

  const processDiscovery = useCallback(
    async (sessionId: string, payload: DiscoveryPayload) => {
      console.log("🌌 Igniting new star:", payload);

      // 1. Persist the knowledge breakthrough in the Journal/Skills table
      await updateSkill(
        payload.topic,
        payload.realm,
        payload.constellationWeight * 10, // Mastery increment
        100, // Target score
      );

      // 2. Mark the specific session as a breakthrough (flags it in the Journal)
      await markBreakthrough(sessionId);

      // 3. Unlock the physical artifact for the diorama
      persistArtifact(payload.artifact);

      // 4. Trigger the Mentor Reaction Event (handled by global UI state)
      // dispatch({ type: "MENTOR_REACTION", payload: { insight: payload.insight, rarity: payload.rarity } });

      return true;
    },
    [updateSkill, markBreakthrough],
  );

  return { processDiscovery };
}
