import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LearningStateProvider, useLearningState } from "@/lib/learning-state-context";
import { MentorAnimationProvider } from "@/lib/mentor-animation-context";
import { MentorSettingsProvider } from "@/lib/mentor-settings-context";
import { ThemeProvider } from "@/lib/theme-context";
import { RealmProvider, DocumentRealmSync } from "@/lib/realm-context";
import { RealmAudioProvider } from "@/lib/useRealmAudio";
import { AmbientBackground } from "@/components/socratic/AmbientBackground";
import { Sidebar } from "@/components/socratic/Sidebar";
import { TopBar } from "@/components/socratic/TopBar";
import { AssetPreloader } from "@/lib/AssetPreloader";

// --- Headless Synchronizer for Global CSS Variables ---
function DocumentStateSync() {
  const { state } = useLearningState();

  useEffect(() => {
    // Dynamically update the root HTML tag so global CSS selectors function correctly
    document.documentElement.setAttribute("data-state", state);
  }, [state]);

  return null;
}

// --- Error Boundaries ---
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold" style={{ color: "var(--ink-primary)" }}>
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold" style={{ color: "var(--ink-secondary)" }}>
          A path that isn't here yet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">No worries — let's walk back together.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-all hover:scale-105"
            style={{
              background: "var(--gold-soft)",
              color: "#0B0B12",
              boxShadow: "0 0 20px rgba(201,162,75,0.2)",
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("[Router Boundary Error]", error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold" style={{ color: "var(--ink-primary)" }}>
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went sideways in the environment.
        </p>
        <div className="mt-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-xl bg-white/[0.05] px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.1]"
            style={{ color: "var(--ink-primary)", border: "1px solid var(--hairline-strong)" }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Root Configuration ---
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lumira — Academy of Discovery" },
      {
        name: "description",
        content:
          "A magical academy where understanding is discovered. Explore worlds, reason with your mentor, and build your constellation.",
      },
      { name: "author", content: "Lumira" },
      { property: "og:title", content: "Lumira — Learn beside someone who believes in you" },
      {
        property: "og:description",
        content:
          "An AI-native, empathetic learning OS. A patient mentor that helps you invent ideas, not memorize them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lumira — Learn beside someone who believes in you" },
      {
        name: "twitter:description",
        content:
          "An AI-native, empathetic learning OS. A patient mentor that helps you invent ideas, not memorize them.",
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/5DoJVPq1TCW0eqnLWPPtLJNimTu2/social-images/social-1780503764936-ChatGPT_Image_Jun_3,_2026,_09_52_22_PM.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/5DoJVPq1TCW0eqnLWPPtLJNimTu2/social-images/social-1780503764936-ChatGPT_Image_Jun_3,_2026,_09_52_22_PM.webp",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  // We remove the hardcoded data-state="IDLE". The DocumentStateSync will handle this.
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RealmProvider>
          <RealmAudioProvider>
            <LearningStateProvider>
              <MentorAnimationProvider>
              <DocumentRealmSync />
              <DocumentStateSync />
              <MentorSettingsProvider>
                <AssetPreloader />
                <AmbientBackground />
                <div className="relative flex min-h-screen w-full">
                  <Sidebar />
                  <div className="flex min-h-screen flex-1 flex-col">
                    <TopBar />
                    <main className="flex-1 p-5 lg:p-10 xl:p-12">
                      <Outlet />
                    </main>
                  </div>
                </div>
              </MentorSettingsProvider>
              </MentorAnimationProvider>
            </LearningStateProvider>
          </RealmAudioProvider>
        </RealmProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
