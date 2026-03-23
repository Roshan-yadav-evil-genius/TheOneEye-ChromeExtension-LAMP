import type { StatsLifetimeBlob } from "../../shared/stats-lifetime-types.ts"

/** Keep in sync with shared/stats-storage-keys.ts */
const STATS_LIFETIME = "lamp_stats_lifetime"

/** Keep in sync with STATS_LIFETIME_DEFAULT in shared/stats-lifetime-types.ts */
const EMPTY_STATS: StatsLifetimeBlob = {
  profilesScored: 0,
  postsScored: 0,
  relevantProfiles: 0,
  relevantPosts: 0,
}

function isStatsLifetimeBlob(x: unknown): x is StatsLifetimeBlob {
  if (!x || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  return (
    typeof o.profilesScored === "number" &&
    typeof o.postsScored === "number" &&
    typeof o.relevantProfiles === "number" &&
    typeof o.relevantPosts === "number"
  )
}

function parseBlob(raw: unknown): StatsLifetimeBlob {
  if (!isStatsLifetimeBlob(raw)) return { ...EMPTY_STATS }
  return {
    profilesScored: Math.max(0, Math.floor(raw.profilesScored)),
    postsScored: Math.max(0, Math.floor(raw.postsScored)),
    relevantProfiles: Math.max(0, Math.floor(raw.relevantProfiles)),
    relevantPosts: Math.max(0, Math.floor(raw.relevantPosts)),
  }
}

export async function incrementScoreStatsAfterEmit(input: {
  kind: "profile" | "post"
  score: number
  threshold: number
}): Promise<void> {
  if (!chrome.storage?.local) return
  const raw = await chrome.storage.local.get(STATS_LIFETIME)
  const prev = parseBlob(raw[STATS_LIFETIME])
  const next: StatsLifetimeBlob = { ...prev }

  if (input.kind === "profile") {
    next.profilesScored += 1
    if (input.score >= input.threshold) {
      next.relevantProfiles += 1
    }
  } else {
    next.postsScored += 1
    if (input.score >= input.threshold) {
      next.relevantPosts += 1
    }
  }

  await chrome.storage.local.set({ [STATS_LIFETIME]: next })
}
