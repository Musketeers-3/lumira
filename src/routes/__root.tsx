import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LearningStateProvider } from "@/lib/learning-state-context";
import { MentorSettingsProvider } from "@/lib/mentor-settings-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AmbientBackground } from "@/components/socratic/AmbientBackground";
import { Sidebar } from "@/components/socratic/Sidebar";
import { TopBar } from "@/components/socratic/TopBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">A path that isn't here yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">No worries — let's walk back together.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went sideways.</p>
        <div className="mt-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lumira — Learn beside someone who believes in you" },
      {
        name: "description",
        content:
          "An AI-native, empathetic learning OS. A patient mentor that helps you invent ideas, not memorize them.",
      },
      { name: "author", content: "Lumira" },
      { property: "og:title", content: "Lumira — Learn beside someone who believes in you" },
      {
        property: "og:description",
        content:
          "An AI-native, empathetic learning OS. A patient mentor that helps you invent ideas, not memorize them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },

    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-state="IDLE">
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
        <LearningStateProvider>
          <MentorSettingsProvider>
            <AmbientBackground />
            <div className="relative flex min-h-screen w-full">
              <Sidebar />
              <div className="flex min-h-screen flex-1 flex-col">
                <TopBar />
                <main className="flex-1 p-5 lg:p-8">
                  <Outlet />
                </main>
              </div>
            </div>
          </MentorSettingsProvider>
        </LearningStateProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
