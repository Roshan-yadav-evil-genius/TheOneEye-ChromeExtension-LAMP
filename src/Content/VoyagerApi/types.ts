import type { Profile } from "../types.ts"
import type { ScoringIntentionSnapshot } from "../../shared/get-intention-from-chrome.ts"
import type { ScoringSettingsBundle } from "../../shared/get-scoring-settings-from-chrome.ts"

/** Keys for optional activity slices merged into the Voyager API payload. */
export type VoyagerActivityKey = "published" | "reacted" | "commented"

/** Raw Voyager JSON buckets attached before sending a profile to the scoring workflow. */
export type ProfileVoyagerApiPayload = {
  profile?: unknown
  published?: unknown
  reacted?: unknown
  commented?: unknown
}

/** DOM profile plus Voyager fetches, intention, and settings for backend scoring. */
export type EnrichedLinkedInProfilePayload = {
  raw: Profile
  api: ProfileVoyagerApiPayload
  intention: ScoringIntentionSnapshot
  settings: ScoringSettingsBundle
}
