'use client';

/**
 * Authentication is intentionally not ended because of inactivity.
 * Supabase's persisted browser session + refresh-token flow keeps users signed
 * in until they explicitly sign out or the Supabase session can no longer be
 * refreshed.
 *
 * This component remains as a compatibility no-op for pages that already
 * mount <IdleLogout />.
 */
export function IdleLogout() {
  return null;
}
