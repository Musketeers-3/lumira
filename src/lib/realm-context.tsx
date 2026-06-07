import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { RealmId } from "./realms";

interface RealmContextValue {
  realm: RealmId;
  setRealm: (realm: RealmId) => void;
}

const RealmContext = createContext<RealmContextValue | null>(null);

const PATH_REALM: Record<string, RealmId> = {
  "/": "hub",
  "/worlds": "hub",
  "/engine": "physics",
  "/skill-passport": "hub",
  "/architecture-log": "hub",
  "/lesson-builder": "hub",
  "/settings": "hub",
};

function realmFromPath(pathname: string, searchRealm?: string): RealmId {
  if (searchRealm && isRealmId(searchRealm)) return searchRealm;
  return PATH_REALM[pathname] ?? "hub";
}

function isRealmId(value: string): value is RealmId {
  return ["hub", "physics", "chemistry", "biology", "math", "history"].includes(value);
}

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const { pathname, search } = useRouterState({
    select: (r) => ({
      pathname: r.location.pathname,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: r.location.search as Record<string, any>,
    }),
  });

  const routeRealm = realmFromPath(pathname, search?.realm);
  const [realm, setRealmState] = useState<RealmId>(routeRealm);

  useEffect(() => {
    setRealmState(routeRealm);
  }, [routeRealm]);

  const setRealm = useCallback((next: RealmId) => {
    setRealmState(next);
  }, []);

  return <RealmContext.Provider value={{ realm, setRealm }}>{children}</RealmContext.Provider>;
}

export function useRealm() {
  const ctx = useContext(RealmContext);
  if (!ctx) throw new Error("useRealm must be used within RealmProvider");
  return ctx;
}

/** Syncs data-realm attribute to document root for CSS theming */
export function DocumentRealmSync() {
  const { realm } = useRealm();

  useEffect(() => {
    document.documentElement.setAttribute("data-realm", realm);
  }, [realm]);

  return null;
}
