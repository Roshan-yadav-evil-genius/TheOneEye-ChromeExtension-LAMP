import type { ParsedMarkerInstruction, Profile } from "../../types.ts"
import { xpathFirstNode, xpathOrderedSnapshot } from "../../utils/dom.ts"
import { extractDirectTextList } from "../../utils/text.ts"
import { isValidLinkedInProfileUrl, matchesExtensionHost } from "../../utils/url.ts"

/** XPath for My Network invitation / connection cards (co-located with this parser). */
const XPATH_MYNETWORK = {
  profile: "//div[a[contains(@href,'/in/')]]",
  profile_link: ".//a[contains(@href,'/in/')]",
  avatarImg: ".//img",
} as const

/** My Network surfaces only — skips feed/search XPaths on other routes. */
export function matchesMyNetworkLocation(loc: Location): boolean {
  return matchesExtensionHost(loc) && loc.pathname.includes("/mynetwork")
}

export function parseMyNetworkProfiles(): ParsedMarkerInstruction[] {
  const out: ParsedMarkerInstruction[] = []
  const profiles = xpathOrderedSnapshot(XPATH_MYNETWORK.profile)

  for (let i = 0; i < profiles.snapshotLength; i++) {
    const node = profiles.snapshotItem(i)
    if (!(node instanceof HTMLElement)) continue

    const profileNode = xpathFirstNode(XPATH_MYNETWORK.profile_link, node)
    if (!(profileNode instanceof HTMLAnchorElement)) continue

    let profileUrl: URL
    try {
      profileUrl = new URL(profileNode.href)
    } catch {
      continue
    }

    if (!isValidLinkedInProfileUrl(profileUrl)) continue

    const profileIdentifier = profileUrl.pathname

    const avatarAndCover: string[] = []
    const profileAvatarAndCover = xpathOrderedSnapshot(
      XPATH_MYNETWORK.avatarImg,
      profileNode
    )
    for (let j = 0; j < profileAvatarAndCover.snapshotLength; j++) {
      const avatarNode = profileAvatarAndCover.snapshotItem(j)
      if (avatarNode instanceof HTMLImageElement) {
        avatarAndCover.push(avatarNode.src)
      }
    }

    const textList = extractDirectTextList(profileNode)

    let profileName: string | null = null
    let profileHeadline: string | null = null
    if (textList.length === 3) {
      profileName = textList[1] ?? null
      profileHeadline = textList[2] ?? null
    }

    if (!(profileUrl.pathname && profileName && profileHeadline)) continue

    const profile: Profile = {
      url: profileIdentifier,
      avatar: avatarAndCover,
      name: profileName,
      headline: profileHeadline,
    }

    out.push({ kind: "profile", anchor: node, data: profile })
  }

  return out
}
