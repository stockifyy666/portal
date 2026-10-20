/**
 * Token-bucket rate limiter for Next.js Edge middleware.
 * Uses an in-memory Map keyed by IP. In production, replace
 * the store with Upstash Redis for multi-instance persistence.
 *
 * Config:
 *   LIMIT   – max requests per window
 *   WINDOW  – window duration in ms
 */

interface Bucket {
  tokens: number
  lastRefill: number
}

const LIMIT = 60       // requests per window
const WINDOW = 60_000  // 1 minute in ms

// Edge runtime: Map lives per isolate, not shared across instances.
// For production use Upstash: https://upstash.com/
const buckets = new Map<string, Bucket>()

export function rateLimit(ip: string): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  let bucket = buckets.get(ip)

  if (!bucket || now - bucket.lastRefill >= WINDOW) {
    bucket = { tokens: LIMIT, lastRefill: now }
  }

  const resetMs = bucket.lastRefill + WINDOW - now

  if (bucket.tokens <= 0) {
    buckets.set(ip, bucket)
    return { allowed: false, remaining: 0, resetMs }
  }

  bucket.tokens -= 1
  buckets.set(ip, bucket)
  return { allowed: true, remaining: bucket.tokens, resetMs }
}

// Stricter limiter for auth endpoints (10 req / min per IP)
const AUTH_LIMIT = 10
const authBuckets = new Map<string, Bucket>()

export function rateLimitAuth(ip: string): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  let bucket = authBuckets.get(ip)

  if (!bucket || now - bucket.lastRefill >= WINDOW) {
    bucket = { tokens: AUTH_LIMIT, lastRefill: now }
  }

  const resetMs = bucket.lastRefill + WINDOW - now

  if (bucket.tokens <= 0) {
    authBuckets.set(ip, bucket)
    return { allowed: false, remaining: 0, resetMs }
  }

  bucket.tokens -= 1
  authBuckets.set(ip, bucket)
  return { allowed: true, remaining: bucket.tokens, resetMs }
}
