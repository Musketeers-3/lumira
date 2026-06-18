import { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Week Grouping Utilities for Learning Journal
 *
 * Provides functions to group sessions by week with smart labels
 * like "This Week", "Last Week", or date ranges for older entries.
 */

export interface SessionEntry {
  _id: string;
  lessonId: string;
  topic: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  performanceScore?: number;
  stateProgression: string[];
  messagesCount: number;
  breakthrough: boolean;
  realm?: string;
  realmName?: string;
}

export interface WeekGroup {
  label: string;
  startDate: Date;
  endDate: Date;
  sessions: SessionEntry[];
}

/**
 * Get the start of the week (Sunday) for a given date
 * Uses locale-independent week start (Sunday)
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the week (Saturday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Generate a human-readable label for a week
 *
 * @param weekStart - The start date of the week (Sunday)
 * @param weekEnd - The end date of the week (Saturday)
 * @param now - Reference date for relative labels (defaults to current date)
 */
export function getWeekLabel(weekStart: Date, weekEnd: Date, now: Date = new Date()): string {
  const currentWeekStart = getWeekStart(now);
  const currentWeekEnd = getWeekEnd(now);

  // This Week
  if (weekStart.getTime() === currentWeekStart.getTime()) {
    return 'This Week';
  }

  // Last Week (previous week)
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  if (weekStart.getTime() === lastWeekStart.getTime()) {
    return 'Last Week';
  }

  // Two Weeks Ago
  const twoWeeksAgoStart = new Date(currentWeekStart);
  twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 14);
  if (weekStart.getTime() === twoWeeksAgoStart.getTime()) {
    return 'Two Weeks Ago';
  }

  // Three Weeks Ago
  const threeWeeksAgoStart = new Date(currentWeekStart);
  threeWeeksAgoStart.setDate(threeWeeksAgoStart.getDate() - 21);
  if (weekStart.getTime() === threeWeeksAgoStart.getTime()) {
    return 'Three Weeks Ago';
  }

  // For older weeks, display date range
  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const startDay = weekStart.getDate();
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const endDay = weekEnd.getDate();
  const year = weekStart.getFullYear();

  // Same month
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`;
  }

  // Different months
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

/**
 * Group sessions by week
 * Sessions are sorted newest first within each group
 * Groups are ordered from newest to oldest
 *
 * @param sessions - Array of sessions to group
 * @returns Array of week groups, each containing sessions from that week
 */
export function groupSessionsByWeek(sessions: SessionEntry[]): WeekGroup[] {
  if (!sessions || sessions.length === 0) {
    return [];
  }

  // Group sessions by week
  const weekMap = new Map<string, SessionEntry[]>();

  for (const session of sessions) {
    const sessionDate = new Date(session.startedAt);
    const weekStart = getWeekStart(sessionDate);
    const weekKey = weekStart.toISOString();

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, []);
    }
    weekMap.get(weekKey)!.push(session);
  }

  // Convert to array and sort sessions within each group (newest first)
  const groups: WeekGroup[] = [];

  for (const [weekKey, weekSessions] of weekMap) {
    const weekStart = new Date(weekKey);
    const weekEnd = getWeekEnd(weekStart);

    // Sort sessions within the group (newest first)
    const sortedSessions = [...weekSessions].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    groups.push({
      label: getWeekLabel(weekStart, weekEnd),
      startDate: weekStart,
      endDate: weekEnd,
      sessions: sortedSessions,
    });
  }

  // Sort groups by date (newest first)
  groups.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  return groups;
}

/**
 * React hook for memoized week grouping
 * Efficiently groups sessions with memoization to prevent regrouping on every render
 *
 * @param sessions - Array of sessions to group
 * @returns Array of week groups
 */
export function useWeekGrouping(sessions: SessionEntry[]): WeekGroup[] {
  return useMemo(() => {
    return groupSessionsByWeek(sessions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);
}

/**
 * Custom hook that returns a stable version of getWeekLabel
 * The returned function maintains the same reference across renders
 */
export function useStableWeekLabel() {
  // Use useCallback with empty deps - the function doesn't need to change
  // because it only reads from its parameters
  return useCallback((weekStart: Date, weekEnd: Date) => {
    return getWeekLabel(weekStart, weekEnd);
  }, []);
}

/**
 * Format a week range for display (alternative format)
 * Used for accessibility or alternative UI displays
 */
export function formatWeekRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', options)}`;
}

/**
 * Check if a week is the current week
 */
export function isCurrentWeek(weekStart: Date, now: Date = new Date()): boolean {
  const currentWeekStart = getWeekStart(now);
  return weekStart.getTime() === currentWeekStart.getTime();
}

/**
 * Get the relative week number from current week (0 = this week, -1 = last week, etc.)
 */
export function getRelativeWeekNumber(weekStart: Date, now: Date = new Date()): number {
  const currentWeekStart = getWeekStart(now);
  const diffTime = currentWeekStart.getTime() - weekStart.getTime();
  const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
  return -diffWeeks;
}