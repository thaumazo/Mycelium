// src/app.d.ts

import { SupabaseClient, Session } from '@supabase/supabase-js'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient
      safeGetSession(): Promise<{ session: Session | null; user: any | null;}>
      profile: any
    }
    interface PageData {
      session: Session | null
      user: any | null
      profile: any | null
    }
    // interface Error {}
    // interface Platform {}
  }
}