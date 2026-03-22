import { STATS_LIFETIME } from "@/constants/popup-storage-keys"
import {
  STATS_LIFETIME_DEFAULT,
  type StatsLifetimeBlob,
} from "../../shared/stats-lifetime-types.ts"

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

export function parseStatsLifetimeBlob(raw: unknown): StatsLifetimeBlob {
  if (!isStatsLifetimeBlob(raw)) return { ...STATS_LIFETIME_DEFAULT }
  return {
    profilesScored: Math.max(0, Math.floor(raw.profilesScored)),
    postsScored: Math.max(0, Math.floor(raw.postsScored)),
    relevantProfiles: Math.max(0, Math.floor(raw.relevantProfiles)),
    relevantPosts: Math.max(0, Math.floor(raw.relevantPosts)),
  }
}

export async function readStatsLifetimeFromChrome(): Promise<StatsLifetimeBlob> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return { ...STATS_LIFETIME_DEFAULT }
  }
  const raw = await chrome.storage.local.get(STATS_LIFETIME)
  return parseStatsLifetimeBlob(raw[STATS_LIFETIME])
}

export async function writeStatsLifetimeToChrome(
  blob: StatsLifetimeBlob
): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) return
  await chrome.storage.local.set({ [STATS_LIFETIME]: blob })
}

export async function resetStatsLifetimeInChrome(): Promise<void> {
  await writeStatsLifetimeToChrome({ ...STATS_LIFETIME_DEFAULT })
}
