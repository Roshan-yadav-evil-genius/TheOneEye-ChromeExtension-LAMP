import { buildVoyagerHeaders } from "./voyager-headers.ts"

const VOYAGER_GRAPHQL_BASE = "https://www.linkedin.com/voyager/api/graphql"

/**
 * Fetches a profile activity GraphQL document by queryId and profile URN.
 *
 * @remarks Authenticated fetch to LinkedIn Voyager; throws on non-OK response.
 */
export async function fetchActivityByQueryId(
  profileUrn: string,
  queryId: string,
  options?: { referer?: string }
): Promise<unknown> {
  const profileUrnEncoded = encodeURIComponent(profileUrn)
  const variablesString = `(count:20,start:0,profileUrn:${profileUrnEncoded})`
  const url =
    `${VOYAGER_GRAPHQL_BASE}?includeWebMetadata=true` +
    `&variables=${variablesString}` +
    `&queryId=${queryId}`

  const res = await fetch(url, {
    method: "GET",
    headers: buildVoyagerHeaders({ referer: options?.referer }),
    credentials: "include",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      (data as { message?: string })?.message ?? res.statusText ?? String(res.status)
    throw new Error(`voyager_activity_${res.status}:${message}`)
  }
  return data
}
