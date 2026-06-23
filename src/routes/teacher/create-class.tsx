/**
 * Teacher Create Class Route
 * Create a new class with auto-generated class code
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTeacherRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { createClass, type ClassData } from "@/services/api/classApi";
import { Sparkles, ArrowLeft, Copy, Check, GraduationCap, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/teacher/create-class")({
  component: CreateClassPage,
});

interface FormErrors {
  className?: string;
  general?: string;
}

function CreateClassPage() {
  const { isLoading } = useTeacherRouteGuard();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [createdClass, setCreatedClass] = useState<ClassData | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    className: "",
    description: "",
  });

  // Show loading while auth is being checked
  if (isLoading) {
    return <RouteGuardLoading />;
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.className.trim()) {
      newErrors.className = "Class name is required";
    } else if (formData.className.trim().length > 100) {
      newErrors.className = "Class name cannot exceed 100 characters";
    }

    if (formData.description.trim().length > 500) {
      newErrors.general = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const newClass = await createClass({
        className: formData.className.trim(),
        description: formData.description.trim() || undefined,
      });
      setCreatedClass(newClass);
    } catch (error) {
      console.error("Create class failed:", error);
      setErrors({
        general:
          error instanceof Error ? error.message : "Failed to create class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    if (createdClass) {
      await navigator.clipboard.writeText(createdClass.classCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToClasses = () => {
    router.navigate({ to: "/teacher-classes" });
  };

  const handleCreateAnother = () => {
    setCreatedClass(null);
    setFormData({ className: "", description: "" });
  };

  // Success view
  if (createdClass) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Success Header */}
        <div
          className="relative overflow-hidden rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
            border: "1px solid var(--hairline)",
          }}
        >
          {/* Success icon */}
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
              boxShadow: "0 0 40px rgba(201,162,75,0.4)",
            }}
          >
            <PartyPopper className="h-10 w-10" style={{ color: "var(--bg-primary)" }} />
          </div>

          <h1
            className="text-2xl md:text-3xl font-semibold font-display mb-3"
            style={{ color: "var(--ink-primary)" }}
          >
            Class Created Successfully!
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-secondary)" }}>
            Your class "{createdClass.className}" has been created. Share the class code with your
            students to enroll them.
          </p>

          {/* Class Code Display */}
          <div
            className="relative inline-block rounded-xl p-6"
            style={{
              background: "var(--bg-primary)",
              border: "2px solid var(--gold)",
              boxShadow: "0 0 30px rgba(201,162,75,0.2)",
            }}
          >
            <div
              className="text-xs uppercase tracking-[0.2em] mb-2"
              style={{ color: "var(--gold-soft)" }}
            >
              Class Code
            </div>
            <div
              className="text-4xl font-mono font-bold tracking-[0.3em]"
              style={{ color: "var(--gold-deep)" }}
            >
              {createdClass.classCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="absolute -top-3 -right-3 p-2 rounded-full transition-all hover:scale-110"
              style={{
                background: "var(--gold)",
                color: "var(--bg-primary)",
                boxShadow: "0 4px 15px rgba(201,162,75,0.4)",
              }}
              title={copied ? "Copied!" : "Copy code"}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs mt-4" style={{ color: "var(--ink-tertiary)" }}>
            {copied ? "Code copied to clipboard!" : "Click the copy button to share the code"}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={handleGoToClasses}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--hairline)",
                color: "var(--ink-primary)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Classes
            </button>
            <button
              onClick={handleCreateAnother}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                color: "var(--bg-primary)",
                boxShadow: "0 4px 20px rgba(201,162,75,0.3)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Page Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(var(--hairline) 1px, transparent 1px),
              linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />

        <div className="relative z-10">
          <div
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] mb-2"
            style={{ color: "var(--gold-soft)" }}
          >
            <Sparkles className="w-3 h-3" />
            Observatory
          </div>
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            Create New Class
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-secondary)" }}>
            Set up a new class to organize your students. A unique class code will be generated
            automatically for student enrollment.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--hairline)" }}
        >
          {/* Error message */}
          {errors.general && (
            <div
              className="mb-6 p-4 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
            >
              {errors.general}
            </div>
          )}

          {/* Class Name */}
          <div className="space-y-2 mb-6">
            <label
              htmlFor="className"
              className="block text-sm font-medium"
              style={{ color: "var(--ink-primary)" }}
            >
              Class Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              id="className"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              placeholder="e.g., Introduction to Physics"
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                background: "var(--bg-primary)",
                border: errors.className ? "1px solid #ef4444" : "1px solid var(--hairline)",
                color: "var(--ink-primary)",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 2px var(--gold)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.className && (
              <p className="text-xs" style={{ color: "#ef4444" }}>
                {errors.className}
              </p>
            )}
            <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
              {formData.className.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2 mb-8">
            <label
              htmlFor="description"
              className="block text-sm font-medium"
              style={{ color: "var(--ink-primary)" }}
            >
              Description <span style={{ color: "var(--ink-tertiary)" }}>(optional)</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn in this class..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 resize-none focus:outline-none focus:ring-2"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--hairline)",
                color: "var(--ink-primary)",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 2px var(--gold)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
            <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
              color: "var(--bg-primary)",
              boxShadow: "0 4px 20px rgba(201,162,75,0.3)",
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  className="h-4 w-4 animate-spin rounded-full border-2"
                  style={{
                    borderColor: "var(--bg-primary) transparent var(--bg-primary) transparent",
                  }}
                />
                Creating...
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4" />
                Create Class
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateClassPage;
