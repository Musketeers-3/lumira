// Path: src/utils/supabase/client.ts or src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Resolve environment variables based on Vite or Next setups dynamically
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Safeguard: If env keys are missing, return a dummy mock client
  // to prevent your local AI engine from crashing during offline development
  if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase credentials missing. Local offline mock client fallback engaged.");

    // Return a lightweight mock shape matching Supabase syntax to keep hooks working cleanly
    return {
      auth: {
        getUser: async () => ({ data: { user: { id: "offline_dev_user" } }, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        insert: () => ({
          select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
        }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
