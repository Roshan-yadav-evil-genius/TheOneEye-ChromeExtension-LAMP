/** Hosts where the content script is injected (see manifest `matches`). */
export function matchesExtensionHost(loc: Pick<Location, "hostname">): boolean {
  return loc.hostname.endsWith("linkedin.com")
}

export function isValidLinkedInProfileUrl(urlObj: URL): boolean {
  const path = urlObj.pathname.replace(/\/+$/, "")
  return /^\/in\/[^/]+$/.test(path)
}

export function tryParseUrl(href: string | null | undefined): URL | null {
  if (!href) return null
  try {
    return new URL(href)
  } catch {
    return null
  }
}
