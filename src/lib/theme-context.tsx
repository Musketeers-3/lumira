import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "lumira.theme";

// Execute synchronously to determine the exact theme before the first DOM paint
function getInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "dark" || saved === "light") return saved;

    // Fallback to the user's OS-level system preferences
    const prefersLight =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize directly from the synchronous function to prevent FOUC (Flash of Unstyled Content)
  const [theme, setThemeState] = useState<Theme>(getInitial);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Push the attribute to the DOM so global CSS variables can react
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      console.warn("Local storage is locked; theme preference will not persist.");
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
