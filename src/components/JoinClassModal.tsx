/**
 * Join Class Modal
 * Allows students to join a class using a class code
 */

import { useState } from "react";
import { X, GraduationCap, CheckCircle, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JoinSuccessData {
  className: string;
  classCode: string;
  teacherName: string;
}

export function JoinClassModal({ isOpen, onClose }: JoinClassModalProps) {
  const [classCode, setClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<JoinSuccessData | null>(null);

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!classCode.trim()) {
      setError("Please enter a class code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { joinClass } = await import("@/services/api/classApi");
      const result = await joinClass({ classCode: classCode.trim() });
      setSuccess(result);
    } catch (err) {
      console.error("Join class failed:", err);
      if (err instanceof Error) {
        if (err.message.includes("401") || err.message.includes("Not authorized")) {
          setError("Please log in as a student to join classes");
        } else if (err.message.includes("404") || err.message.includes("Invalid class code")) {
          setError("Invalid class code. Please check and try again.");
        } else if (
          err.message.includes("already enrolled") ||
          err.message.includes("already joined")
        ) {
          setError("You are already enrolled in this class");
        } else if (err.message.includes("403") || err.message.includes("Only students")) {
          setError("Only students can join classes");
        } else {
          setError(err.message || "Failed to join class. Please try again.");
        }
      } else {
        setError("Failed to join class. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClassCode("");
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleGoToClasses = () => {
    handleClose();
    // Navigate to enrolled classes page if it exists
    window.location.href = "/enrolled-classes";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--hairline)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "var(--ink-tertiary)" }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success State */}
        {success ? (
          <div className="text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                boxShadow: "0 0 30px rgba(201,162,75,0.3)",
              }}
            >
              <CheckCircle className="h-8 w-8" style={{ color: "var(--bg-primary)" }} />
            </div>

            <h2
              className="text-xl font-semibold font-display mb-2"
              style={{ color: "var(--ink-primary)" }}
            >
              Class Joined Successfully!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-secondary)" }}>
              You are now enrolled in this class.
            </p>

            <div
              className="p-4 rounded-xl mb-6 text-left"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--hairline)",
              }}
            >
              <div className="space-y-3">
                <div>
                  <div
                    className="text-xs uppercase tracking-[0.15em]"
                    style={{ color: "var(--ink-tertiary)" }}
                  >
                    Class
                  </div>
                  <div className="font-medium" style={{ color: "var(--ink-primary)" }}>
                    {success.className}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs uppercase tracking-[0.15em]"
                    style={{ color: "var(--ink-tertiary)" }}
                  >
                    Teacher
                  </div>
                  <div className="font-medium" style={{ color: "var(--ink-primary)" }}>
                    {success.teacherName}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs uppercase tracking-[0.15em]"
                    style={{ color: "var(--ink-tertiary)" }}
                  >
                    Code
                  </div>
                  <div className="font-mono font-medium" style={{ color: "var(--gold-deep)" }}>
                    {success.classCode}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGoToClasses}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                color: "var(--bg-primary)",
                boxShadow: "0 4px 20px rgba(201,162,75,0.3)",
              }}
            >
              Go to Class
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Form State */
          <div className="text-center">
            <div
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                boxShadow: "0 0 25px rgba(201,162,75,0.3)",
              }}
            >
              <GraduationCap className="h-7 w-7" style={{ color: "var(--bg-primary)" }} />
            </div>

            <h2
              className="text-xl font-semibold font-display mb-2"
              style={{ color: "var(--ink-primary)" }}
            >
              Join a Class
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-secondary)" }}>
              Enter the class code from your teacher to join.
            </p>

            {/* Error message */}
            {error && (
              <div
                className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Class Code Input */}
            <div className="space-y-2 mb-6">
              <input
                type="text"
                value={classCode}
                onChange={(e) => {
                  setClassCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="Enter class code"
                maxLength={6}
                className="w-full px-4 py-4 rounded-xl text-center text-lg font-mono font-bold tracking-[0.3em] uppercase transition-all duration-300 focus:outline-none focus:ring-2"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--hairline)",
                  color: "var(--ink-primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,162,75,0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--hairline)";
                  e.target.style.boxShadow = "none";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoin();
                  }
                }}
              />
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                6-character code (e.g., K5U45E)
              </p>
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoin}
              disabled={isLoading || !classCode.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                color: "var(--bg-primary)",
                boxShadow: "0 4px 20px rgba(201,162,75,0.3)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" />
                  Join Class
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinClassModal;
