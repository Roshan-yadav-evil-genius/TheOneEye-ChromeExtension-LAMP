import { buildVoyagerHeaders } from "./voyager-headers.ts"

const VOYAGER_DECORATION_ID =
  "com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-91"

/**
 * Loads dash profile JSON for a public `/in/{id}` handle from Voyager.
 *
 * @remarks Authenticated GET; throws on non-OK response.
 */
export async function fetchProfileVoyagerData(
  publicIdentifier: string
): Promise<unknown> {
  const params = new URLSearchParams({
    decorationId: VOYAGER_DECORATION_ID,
    memberIdentity: publicIdentifier,
    q: "memberIdentity",
  })
  const url = `https://www.linkedin.com/voyager/api/identity/dash/profiles?${params}`

  const res = await fetch(url, {
    method: "GET",
    headers: buildVoyagerHeaders(),
    credentials: "include",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ?? res.statusText ?? String(res.status)
    throw new Error(`voyager_profile_${res.status}:${message}`)
  }
  return data
}

/** Extracts `urn:li:fsd_profile:…` from a profile Voyager JSON response. */
export function getProfileUrnFromVoyagerResponse(response: unknown): string | null {
  const r = response as {
    data?: {
      "*elements"?: unknown[]
      elements?: unknown[]
    }
    included?: Array<{ entityUrn?: string }>
  }

  const first = r?.data?.["*elements"]?.[0] ?? r?.data?.elements?.[0]
  if (typeof first === "string" && first.startsWith("urn:li:fsd_profile:")) {
    return first
  }

  const included = r?.included
  if (Array.isArray(included)) {
    const found = included.find(
      (e) =>
        typeof e?.entityUrn === "string" &&
        e.entityUrn.startsWith("urn:li:fsd_profile:")
    )
    if (found?.entityUrn) return found.entityUrn
  }

  return null
}
