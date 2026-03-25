import { isExtensionContextInvalidatedError } from "../../shared/chrome-context-errors.ts"
import type { DashboardThresholdHit } from "../../shared/dashboard-storage-types.ts"
import type { MarkerKind, Post, Profile } from "../types.ts"

/** Keep in sync with shared/dashboard-storage-keys.ts (content bundle avoids shared key imports). */
const DASHBOARD_THRESHOLD_HITS = "dashboard_threshold_hits"

/** Type guard for Profile-shaped JSON from storage. */
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

/** Normalized profile URL for deduping dashboard rows. */
function dedupeUrlFromProfile(profile: Profile): string | null {
  const u = profile.url.trim()
  return u.length > 0 ? u : null
}

function dedupeUrlFromPost(post: Post): string | null {
  return dedupeUrlFromProfile(post.publisher)
}

/** Dedupe key for an existing dashboard hit row. */
function dedupeUrlForHit(hit: DashboardThresholdHit): string | null {
  return hit.source === "profile"
    ? dedupeUrlFromProfile(hit.profile)
    : dedupeUrlFromPost(hit.post)
}

/** Parses and validates persisted threshold hit list from storage. */
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

/** Appends a profile hit if score meets threshold and URL not already listed. */
async function maybeAppendProfileHit(
  profile: Profile,
  score: number,
  threshold: number
): Promise<void> {
  const raw = await chrome.storage.local.get(DASHBOARD_THRESHOLD_HITS)
  const list = parseThresholdHits(raw[DASHBOARD_THRESHOLD_HITS])
  const url = dedupeUrlFromProfile(profile)
  if (url !== null && list.some((h) => dedupeUrlForHit(h) === url)) {
    return
  }
  const now = Date.now()
  list.push({
    id: crypto.randomUUID(),
    scoredAt: now,
    score,
    threshold,
    source: "profile",
    profile,
  })
  await chrome.storage.local.set({ [DASHBOARD_THRESHOLD_HITS]: list })
}

/** Appends a post hit if score meets threshold and publisher URL not already listed. */
async function maybeAppendPostHit(
  post: Post,
  score: number,
  threshold: number
): Promise<void> {
  try {
    const raw = await chrome.storage.local.get(DASHBOARD_THRESHOLD_HITS)
    const list = parseThresholdHits(raw[DASHBOARD_THRESHOLD_HITS])
    const url = dedupeUrlFromPost(post)
    if (url !== null && list.some((h) => dedupeUrlForHit(h) === url)) {
      return
    }
    const now = Date.now()
    list.push({
      id: crypto.randomUUID(),
      scoredAt: now,
      score,
      threshold,
      source: "post",
      post,
    })
    await chrome.storage.local.set({ [DASHBOARD_THRESHOLD_HITS]: list })
  } catch (e) {
    if (!isExtensionContextInvalidatedError(e)) throw e
  }
}

/**
 * Records a threshold-qualified score in chrome.storage for the popup dashboard when data validates.
 *
 * @remarks Dedupes by profile/post publisher URL; ignores invalid payloads.
 */
export async function appendDashboardThresholdHit(input: {
  kind: MarkerKind
  data: unknown
  score: number
  threshold: number
}): Promise<void> {
  if (input.kind === "profile") {
    if (!isProfile(input.data)) return
    await maybeAppendProfileHit(input.data, input.score, input.threshold)
    return
  }
  if (!isPost(input.data)) return
  await maybeAppendPostHit(input.data, input.score, input.threshold)
}
