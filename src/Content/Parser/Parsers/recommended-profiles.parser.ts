import type { ParsedMarkerInstruction, Profile } from "../../types.ts"
import { xpathFirstNode, xpathOrderedSnapshot } from "../../utils/dom.ts"
import { isValidLinkedInProfileUrl, matchesExtensionHost } from "../../utils/url.ts"

/**
 * Recommended feed profile cards (two /in/ links, avatar or ghost name).
 * XPath co-located with this parser.
 */
const XPATH_RECOMMENDED = {
  profile:
    "//div[   count(.//a[contains(@href,'/in/')]) = 2   and   .//a[contains(@href,'/in/')][.//img or .//div[contains(@class,'ghost-person')]]   and   not(.//div[     count(.//a[contains(@href,'/in/')]) = 2     and     .//a[contains(@href,'/in/')][.//img or .//div[contains(@class,'ghost-person')]]   ]) ]",
  links: ".//a[contains(@href,'/in/')]",
  avatarImg: ".//a[contains(@href,'/in/')][1]//img",
  ghostName:
    ".//a[contains(@href,'/in/')][1]//div[contains(@class,'ghost-person')]",
  headline:
    ".//a[contains(@href,'/in/') and not(.//img or .//div[contains(@class,'ghost-person')])]/*[2]",
} as const

/** Main feed / home where recommended people cards appear. */
export function matchesFeedRecommendedLocation(loc: Location): boolean {
  if (!matchesExtensionHost(loc)) return false
  const p = loc.pathname.replace(/\/+$/, "") || "/"
  return p === "/" || p === "/feed" || p.startsWith("/feed/")
}

/** Extracts “recommended for you” profile card markers from the main feed DOM. */
export function parseRecommendedProfiles(): ParsedMarkerInstruction[] {
  const out: ParsedMarkerInstruction[] = []
  const profiles = xpathOrderedSnapshot(XPATH_RECOMMENDED.profile)

  for (let i = 0; i < profiles.snapshotLength; i++) {
    const node = profiles.snapshotItem(i)
    if (!(node instanceof HTMLElement)) continue

    const links = xpathOrderedSnapshot(XPATH_RECOMMENDED.links, node)
    let profileIdentifier: string | null = null

    for (let j = 0; j < links.snapshotLength; j++) {
      const link = links.snapshotItem(j)
      if (!(link instanceof HTMLAnchorElement)) continue
      let url: URL
      try {
        url = new URL(link.href)
      } catch {
        continue
      }
      if (isValidLinkedInProfileUrl(url)) {
        profileIdentifier = url.pathname
        break
      }
    }

    if (!profileIdentifier) continue

    const avatarAndCover: string[] = []
    const avatarNode = xpathFirstNode(XPATH_RECOMMENDED.avatarImg, node)
    const imgEl =
      avatarNode instanceof HTMLImageElement ? avatarNode : null
    if (imgEl) avatarAndCover.push(imgEl.src)

    let name: string | null = imgEl?.alt ?? null

    if (!imgEl) {
      const ghost = xpathFirstNode(XPATH_RECOMMENDED.ghostName, node)
      name =
        ghost?.textContent?.replace(/\s+/g, " ").trim() ?? null
    }

    const headlineNode = xpathFirstNode(XPATH_RECOMMENDED.headline, node)
    const headline = headlineNode?.textContent?.trim() ?? null

    if (!(profileIdentifier && name && headline)) continue

    const profile: Profile = {
      url: profileIdentifier,
      avatar: avatarAndCover,
      name,
      headline,
    }

    out.push({ kind: "profile", anchor: node, data: profile })
  }

  return out
}
