// Lightweight in-memory rate limiter for AI endpoints.
//
// NOTE: this resets whenever the server process restarts and does not
// share state across multiple server instances. It's sufficient for a
// single-instance deployment or local dev. For production behind multiple
// serverless instances, swap this for Upstash Redis (`@upstash/ratelimit`)
// using the same `checkRateLimit` call signature.

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 12; // per user, per window, per endpoint

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - bucket.windowStart) };
  }

  bucket.count += 1;
  return { allowed: true };
}
