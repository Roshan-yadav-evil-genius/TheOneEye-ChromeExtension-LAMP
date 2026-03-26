import {
  DASHBOARD_POST_HITS,
  DASHBOARD_PROFILE_HITS,
  DASHBOARD_QUALIFIED,
  DASHBOARD_THRESHOLD_HITS,
} from "@/constants/popup-storage-keys"
import type {
  DashboardPostHitLegacy,
  DashboardProfileHitLegacy,
  DashboardQualifiedRow,
  DashboardThresholdHit,
} from "../../shared/dashboard-storage-types.ts"
import type { Post, Profile } from "../../Content/types.ts"

/**
 * chrome.storage helpers for dashboard threshold hits (with legacy migration) and qualified rows.
 */

/** Type guard for Profile JSON in storage rows. */
function isProfile(x: unknown): x is Profile {
  if (!x || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  return (
    typeof o.url === "string" &&
    Array.isArray(o.avatar) &&
    o.avatar.every((a) => typeof a === "string") &&
    typeof o.name === "string" &&
    typeof o.headline === "string"
  )
}

/** Type guard for Post JSON in storage rows. */
function isPost(x: unknown): x is Post {
  if (!x || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  if (!isProfile(o.publisher)) return false
  const p = o.post
  if (!p || typeof p !== "object") return false
  const pr = p as Record<string, unknown>
  return (
    (pr.content === null || typeof pr.content === "string") &&
    Array.isArray(pr.image) &&
    pr.image.every((i) => typeof i === "string") &&
    (pr.postedDateIso === null || typeof pr.postedDateIso === "string")
  )
}

/** Validates unified threshold hit array from storage. */
function parseThresholdHits(raw: unknown): DashboardThresholdHit[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((row): row is DashboardThresholdHit => {
    if (!row || typeof row !== "object") return false
    const r = row as Record<string, unknown>
    if (
      typeof r.id !== "string" ||
      typeof r.scoredAt !== "number" ||
      typeof r.score !== "number" ||
      typeof r.threshold !== "number" ||
      typeof r.source !== "string"
    ) {
      return false
    }
    if (r.source === "profile" && isProfile(r.profile)) return true
    if (r.source === "post" && isPost(r.post)) return true
    return false
  })
}

function parseLegacyProfileHits(raw: unknown): DashboardProfileHitLegacy[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (row): row is DashboardProfileHitLegacy =>
      row &&
      typeof row === "object" &&
      typeof (row as DashboardProfileHitLegacy).id === "string" &&
      typeof (row as DashboardProfileHitLegacy).scoredAt === "number" &&
      typeof (row as DashboardProfileHitLegacy).score === "number" &&
      typeof (row as DashboardProfileHitLegacy).threshold === "number" &&
      isProfile((row as DashboardProfileHitLegacy).profile) &&
      !("source" in row)
  )
}

/** Parses pre-unification post-only hit list. */
function parseLegacyPostHits(raw: unknown): DashboardPostHitLegacy[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (row): row is DashboardPostHitLegacy =>
      row &&
      typeof row === "object" &&
      typeof (row as DashboardPostHitLegacy).id === "string" &&
      typeof (row as DashboardPostHitLegacy).scoredAt === "number" &&
      typeof (row as DashboardPostHitLegacy).score === "number" &&
      typeof (row as DashboardPostHitLegacy).threshold === "number" &&
      isPost((row as DashboardPostHitLegacy).post) &&
      !("source" in row)
  )
}

/** Normalized profile URL for dedupe. */
function dedupeUrlFromProfile(profile: Profile): string | null {
  const u = profile.url.trim()
  return u.length > 0 ? u : null
}

/** Dedupe key from post publisher URL. */
function dedupeUrlFromPost(post: Post): string | null {
  return dedupeUrlFromProfile(post.publisher)
}

/** Dedupe key for a unified hit row. */
function dedupeUrlForHit(hit: DashboardThresholdHit): string | null {
  return hit.source === "profile"
    ? dedupeUrlFromProfile(hit.profile)
    : dedupeUrlFromPost(hit.post)
}

/** Merges legacy post/profile lists into unified rows with URL dedupe. */
function migrateLegacyToUnified(
  legacyPosts: DashboardPostHitLegacy[],
  legacyProfiles: DashboardProfileHitLegacy[]
): DashboardThresholdHit[] {
  const merged: DashboardThresholdHit[] = []
  const seen = new Set<string>()
  const push = (h: DashboardThresholdHit) => {
    const u = dedupeUrlForHit(h)
    if (u !== null) {
      if (seen.has(u)) return
      seen.add(u)
    }
    merged.push(h)
  }
  for (const h of legacyProfiles) {
    push({
      id: h.id,
      scoredAt: h.scoredAt,
      score: h.score,
      threshold: h.threshold,
      source: "profile",
      profile: h.profile,
    })
  }
  for (const h of legacyPosts) {
    push({
      id: h.id,
      scoredAt: h.scoredAt,
      score: h.score,
      threshold: h.threshold,
      source: "post",
      post: h.post,
    })
  }
  return merged
}

/** Loads threshold hits, migrating legacy keys to DASHBOARD_THRESHOLD_HITS once. */
async function loadThresholdHitsWithMigration(): Promise<
  DashboardThresholdHit[]
> {
  const raw = await chrome.storage.local.get([
    DASHBOARD_THRESHOLD_HITS,
    DASHBOARD_POST_HITS,
    DASHBOARD_PROFILE_HITS,
  ])
  let unified = parseThresholdHits(raw[DASHBOARD_THRESHOLD_HITS])
  if (unified.length > 0) {
    if (
      raw[DASHBOARD_POST_HITS] !== undefined ||
      raw[DASHBOARD_PROFILE_HITS] !== undefined
    ) {
      await chrome.storage.local.remove([
        DASHBOARD_POST_HITS,
        DASHBOARD_PROFILE_HITS,
      ])
    }
    return unified
  }

  const legacyPosts = parseLegacyPostHits(raw[DASHBOARD_POST_HITS])
  const legacyProfiles = parseLegacyProfileHits(raw[DASHBOARD_PROFILE_HITS])
  if (legacyPosts.length === 0 && legacyProfiles.length === 0) return []

  unified = migrateLegacyToUnified(legacyPosts, legacyProfiles)
  await chrome.storage.local.set({ [DASHBOARD_THRESHOLD_HITS]: unified })
  await chrome.storage.local.remove([DASHBOARD_POST_HITS, DASHBOARD_PROFILE_HITS])
  return unified
}

/** Validates qualified profile rows from storage. */
function parseQualified(raw: unknown): DashboardQualifiedRow[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (row): row is DashboardQualifiedRow =>
      row &&
      typeof row === "object" &&
      typeof (row as DashboardQualifiedRow).id === "string" &&
      typeof (row as DashboardQualifiedRow).qualifiedAt === "number" &&
      isProfile((row as DashboardQualifiedRow).profile)
  )
}

/** Threshold hits split by source plus qualified list for the dashboard UI. */
export type DashboardListsSnapshot = {
  thresholdHits: DashboardThresholdHit[]
  postHits: Extract<DashboardThresholdHit, { source: "post" }>[]
  profileHits: Extract<DashboardThresholdHit, { source: "profile" }>[]
  qualified: DashboardQualifiedRow[]
}

/** Reads dashboard lists from chrome.storage.local (runs migration when needed). */
export async function readDashboardLists(): Promise<DashboardListsSnapshot> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return {
      thresholdHits: [],
      postHits: [],
      profileHits: [],
      qualified: [],
    }
  }
  const [thresholdHits, qualifiedRaw] = await Promise.all([
    loadThresholdHitsWithMigration(),
    chrome.storage.local.get(DASHBOARD_QUALIFIED),
  ])
  const qualified = parseQualified(qualifiedRaw[DASHBOARD_QUALIFIED])
  const postHits = thresholdHits.filter(
    (h): h is Extract<DashboardThresholdHit, { source: "post" }> =>
      h.source === "post"
  )
  const profileHits = thresholdHits.filter(
    (h): h is Extract<DashboardThresholdHit, { source: "profile" }> =>
      h.source === "profile"
  )
  return { thresholdHits, postHits, profileHits, qualified }
}

/** Removes one threshold hit row by id. */
export async function dropThresholdHit(id: string): Promise<void> {
  const list = await loadThresholdHitsWithMigration()
  await chrome.storage.local.set({
    [DASHBOARD_THRESHOLD_HITS]: list.filter((h) => h.id !== id),
  })
}

/** Removes one qualified profile row by id. */
export async function dropQualified(id: string): Promise<void> {
  const raw = await chrome.storage.local.get(DASHBOARD_QUALIFIED)
  const list = parseQualified(raw[DASHBOARD_QUALIFIED])
  await chrome.storage.local.set({
    [DASHBOARD_QUALIFIED]: list.filter((h) => h.id !== id),
  })
}

/** Moves a threshold hit into the qualified list and drops it from threshold storage. */
export async function qualifyThresholdHit(id: string): Promise<void> {
  const list = await loadThresholdHitsWithMigration()
  const hit = list.find((h) => h.id === id)
  if (!hit) return
  const rawQ = await chrome.storage.local.get(DASHBOARD_QUALIFIED)
  const qualified = parseQualified(rawQ[DASHBOARD_QUALIFIED])
  const profile =
    hit.source === "post" ? hit.post.publisher : hit.profile
  await chrome.storage.local.set({
    [DASHBOARD_THRESHOLD_HITS]: list.filter((h) => h.id !== id),
    [DASHBOARD_QUALIFIED]: [
      ...qualified,
      {
        id: crypto.randomUUID(),
        qualifiedAt: Date.now(),
        profile,
      },
    ],
  })
}

/** Clears Posts and Profiles lists only; Qualified list is unchanged. */
export async function clearThresholdHitsPreservingQualified(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) return
  await chrome.storage.local.set({
    [DASHBOARD_THRESHOLD_HITS]: [],
  })
  await chrome.storage.local.remove([
    DASHBOARD_POST_HITS,
    DASHBOARD_PROFILE_HITS,
  ])
}

/** Keys watched by the dashboard hook for live updates. */
export const DASHBOARD_STORAGE_KEYS = [
  DASHBOARD_THRESHOLD_HITS,
  DASHBOARD_POST_HITS,
  DASHBOARD_PROFILE_HITS,
  DASHBOARD_QUALIFIED,
] as const
