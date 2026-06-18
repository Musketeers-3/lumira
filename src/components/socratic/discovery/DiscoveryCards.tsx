import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, SortAsc, Sparkles, PlayCircle } from "lucide-react";
import {
  getDiscoverLessons,
  type DiscoverLesson,
  type LessonRealm,
  type LessonDifficulty,
} from "@/services/api/lessonApi";
import { DiscoveryCard } from "./DiscoveryCard";
import { GlassPanel } from "@/components/socratic/premium/GlassPanel";
import { Reveal } from "@/components/socratic/premium/Reveal";
import { cn } from "@/lib/utils";

interface DiscoveryCardsProps {
  className?: string;
}

type SortOption = "newest" | "recommended" | "progress";

const REALM_OPTIONS: { value: LessonRealm | ""; label: string }[] = [
  { value: "", label: "All Worlds" },
  { value: "physics", label: "Observatory of Physics" },
  { value: "chemistry", label: "Alchemist's Laboratory" },
  { value: "biology", label: "Living Garden of Biology" },
  { value: "math", label: "Hall of Infinite Patterns" },
  { value: "history", label: "Archive of Human Stories" },
];

const DIFFICULTY_OPTIONS: { value: LessonDifficulty | ""; label: string }[] = [
  { value: "", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "recommended", label: "Recommended" },
  { value: "progress", label: "Continue Learning" },
];

export function DiscoveryCards({ className }: DiscoveryCardsProps) {
  const [realmFilter, setRealmFilter] = useState<LessonRealm | "">("");
  const [difficultyFilter, setDifficultyFilter] = useState<LessonDifficulty | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const {
    data: lessons = [],
    isLoading,
    error,
  } = useQuery<DiscoverLesson[]>({
    queryKey: ["discover-lessons", realmFilter, difficultyFilter, sortBy],
    queryFn: () =>
      getDiscoverLessons({
        realm: realmFilter || undefined,
        difficulty: difficultyFilter || undefined,
        sort: sortBy === "recommended" ? "progress" : sortBy,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter by search query on client side for responsiveness
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const query = searchQuery.toLowerCase();
    return lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(query) ||
        lesson.description?.toLowerCase().includes(query) ||
        lesson.topic?.toLowerCase().includes(query),
    );
  }, [lessons, searchQuery]);

  // Separate in-progress lessons for "Continue Learning" section
  const inProgressLessons = useMemo(
    () => filteredLessons.filter((l) => l.status === "in_progress"),
    [filteredLessons],
  );

  const otherLessons = useMemo(
    () => filteredLessons.filter((l) => l.status !== "in_progress"),
    [filteredLessons],
  );

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <Reveal>
        <div className="text-center space-y-3">
          <h2
            className="text-2xl font-display font-semibold"
            style={{ color: "var(--ink-primary)" }}
          >
            Discover <span className="text-gold">Lessons</span>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--ink-secondary)" }}>
            Explore curated lessons across all worlds. Pick up where you left off or start something
            new.
          </p>
        </div>
      </Reveal>

      {/* Filters */}
      <Reveal delay={100}>
        <GlassPanel className="p-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--ink-tertiary)" }}
              />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-gold/50 transition-colors"
                style={{ color: "var(--ink-primary)" }}
              />
            </div>

            {/* Realm Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--ink-tertiary)" }}
              />
              <select
                value={realmFilter}
                onChange={(e) => setRealmFilter(e.target.value as LessonRealm | "")}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
                style={{ color: "var(--ink-primary)" }}
              >
                {REALM_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    style={{ background: "var(--bg-primary)" }}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as LessonDifficulty | "")}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
              style={{ color: "var(--ink-primary)" }}
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{ background: "var(--bg-primary)" }}
                >
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="relative">
              <SortAsc
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--ink-tertiary)" }}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
                style={{ color: "var(--ink-primary)" }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    style={{ background: "var(--bg-primary)" }}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassPanel>
      </Reveal>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold border-t-transparent" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <GlassPanel className="p-6 text-center">
          <p style={{ color: "var(--ink-secondary)" }}>Unable to load lessons. Please try again.</p>
        </GlassPanel>
      )}

      {/* Continue Learning Section */}
      {!isLoading && !error && inProgressLessons.length > 0 && (
        <Reveal delay={200}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              <h3
                className="text-lg font-semibold font-display"
                style={{ color: "var(--ink-primary)" }}
              >
                Continue Learning
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressLessons.slice(0, 3).map((lesson, idx) => (
                <Reveal key={lesson._id} delay={idx * 100}>
                  <DiscoveryCard lesson={lesson} />
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* All Lessons Section */}
      {!isLoading && !error && (
        <Reveal delay={300}>
          <div className="space-y-4">
            {inProgressLessons.length > 0 && (
              <h3
                className="text-lg font-semibold font-display"
                style={{ color: "var(--ink-primary)" }}
              >
                All Lessons
              </h3>
            )}
            {filteredLessons.length === 0 ? (
              <GlassPanel className="p-8 text-center space-y-3">
                <PlayCircle
                  className="h-12 w-12 mx-auto"
                  style={{ color: "var(--ink-tertiary)" }}
                />
                <p className="font-medium" style={{ color: "var(--ink-primary)" }}>
                  No lessons found
                </p>
                <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
                  Try adjusting your filters or search query.
                </p>
              </GlassPanel>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherLessons.map((lesson, idx) => (
                  <Reveal key={lesson._id} delay={(idx % 4) * 50}>
                    <DiscoveryCard lesson={lesson} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}
