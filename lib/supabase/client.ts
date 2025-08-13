import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

let clientInstance: ReturnType<typeof createClientComponentClient> | null = null

export function createClient() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        signInWithPassword: () =>
          Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
        signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    }
  }

  if (!clientInstance) {
    clientInstance = createClientComponentClient()
  }

  return clientInstance
}

// Keep backward compatibility
export const supabase = createClient()
