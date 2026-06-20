/**
 * ArtifactUnlockModal Component
 *
 * Shows a modal when a new artifact is unlocked.
 */

import { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ArtifactMetadata } from "@/artifacts/types";

interface ArtifactUnlockModalProps {
  isOpen: boolean;
  artifact: ArtifactMetadata | null;
  onClose: () => void;
}

export const ArtifactUnlockModal = memo(function ArtifactUnlockModal({
  isOpen,
  artifact,
  onClose,
}: ArtifactUnlockModalProps) {
  if (!artifact) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-2">
            <span className="text-4xl animate-bounce">✨</span>
            <span style={{ color: "var(--gold-soft)" }}>New Artifact Discovered</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Artifact Icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl animate-pulse"
            style={{
              background: `linear-gradient(135deg, var(--gold-soft), var(--gold-deep))`,
              boxShadow: "0 0 30px rgba(201, 162, 75, 0.4)",
            }}
          >
            {artifact.icon}
          </div>

          {/* Artifact Name */}
          <div className="text-center">
            <h3
              className="text-xl font-semibold font-display"
              style={{ color: "var(--ink-primary)" }}
            >
              {artifact.name}
            </h3>
            <p className="text-sm mt-2" style={{ color: "var(--ink-secondary)" }}>
              {artifact.description}
            </p>
          </div>

          {/* Rarity Badge */}
          <div
            className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
            style={{
              background:
                artifact.rarity === "legendary"
                  ? "rgba(201, 162, 75, 0.2)"
                  : artifact.rarity === "rare"
                    ? "rgba(59, 158, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.05)",
              color:
                artifact.rarity === "legendary"
                  ? "var(--gold-soft)"
                  : artifact.rarity === "rare"
                    ? "#3B9EFF"
                    : "var(--ink-tertiary)",
              border: `1px solid ${
                artifact.rarity === "legendary"
                  ? "var(--gold-deep)"
                  : artifact.rarity === "rare"
                    ? "#3B9EFF"
                    : "var(--hairline)"
              }`,
            }}
          >
            {artifact.rarity}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-medium transition-all hover:scale-105"
            style={{
              background: "var(--gold)",
              color: "var(--bg-primary)",
            }}
          >
            Collect
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default ArtifactUnlockModal;
