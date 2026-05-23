import { useContext } from "react";
import { MentorSettingsContext } from "./mentor-settings-context";

export function useMentorSettings() {
  const ctx = useContext(MentorSettingsContext);
  if (!ctx) throw new Error("useMentorSettings must be used within MentorSettingsProvider");
  return ctx;
}

export function useMentorSettingsOptional() {
  return useContext(MentorSettingsContext);
}
