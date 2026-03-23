import type { IntentionPayload } from "../Popup/types/extension-settings.ts"

/**
 * Must match Popup `constants/popup-storage-keys.ts` (inlined for SW bundle).
 */
const INTENTION_PROFILE = "intention_profile" as const
const INTENTION_POST = "intention_post" as const
const INTENTION_KEYWORDS = "intention_keywords" as const
const INTENTION_HEADLINE_TAGS = "intention_headline_tags" as const

const EMPTY: IntentionPayload = {
  profileDescription: "",
  postDescription: "",
  keywords: [],
  headlineTags: [],
}

/**
 * Reads persisted intention fields from chrome.storage.local for scoring.
 */
export async function getIntentionFromChrome(): Promise<IntentionPayload> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return { ...EMPTY }
  }

  const raw = await chrome.storage.local.get([
    INTENTION_PROFILE,
    INTENTION_POST,
    INTENTION_KEYWORDS,
    INTENTION_HEADLINE_TAGS,
  ])

  const out: IntentionPayload = { ...EMPTY }

  if (typeof raw[INTENTION_PROFILE] === "string") {
    out.profileDescription = raw[INTENTION_PROFILE]
  }
  if (typeof raw[INTENTION_POST] === "string") {
    out.postDescription = raw[INTENTION_POST]
  }
  if (Array.isArray(raw[INTENTION_KEYWORDS])) {
    out.keywords = raw[INTENTION_KEYWORDS].filter(
      (k): k is string => typeof k === "string"
    )
  }
  if (Array.isArray(raw[INTENTION_HEADLINE_TAGS])) {
    out.headlineTags = raw[INTENTION_HEADLINE_TAGS].filter(
      (k): k is string => typeof k === "string"
    )
  }

  return out
}

export type { IntentionPayload as ScoringIntentionSnapshot }
