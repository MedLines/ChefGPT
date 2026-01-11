type RateLimitStore = Map<string, number[]>

const store: RateLimitStore = new Map()

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = store.get(ip) || []

  // Filter out old timestamps
  const recentTimestamps = timestamps.filter((time) => now - time < WINDOW_MS)

  if (recentTimestamps.length >= MAX_REQUESTS) {
    return false
  }

  recentTimestamps.push(now)
  store.set(ip, recentTimestamps)
  return true
}
