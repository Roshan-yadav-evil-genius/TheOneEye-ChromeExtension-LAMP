import type { Post, Profile } from "../../Content/types.ts"
import type { EnrichedLinkedInProfilePayload } from "../../Content/VoyagerApi/types.ts"

/** Runtime message type: content asks the service worker to score a marker. */
export const SCORE_MARKER_MESSAGE_TYPE = "scoreMarker" as const
/** Runtime message type: service sends numeric score back to the content script. */
export const MARKER_SCORE_RESULT_TYPE = "markerScoreResult" as const
/** Runtime message type: service reports scoring failure to the content script. */
export const MARKER_SCORE_ERROR_TYPE = "markerScoreError" as const

/** Inbound payload from content: score this profile or post (optional Voyager-enriched profile). */
export type ScoreMarkerInboundMessage = {
  type: typeof SCORE_MARKER_MESSAGE_TYPE
  markerId: string
  kind: "profile" | "post"
  data: Profile | Post
  enrichedProfile?: EnrichedLinkedInProfilePayload
}

/** Outbound score success fields sent to the tab (mirrors inbound data + score + threshold). */
export type TabMarkerScorePayload = {
  markerId: string
  kind: "profile" | "post"
  data: Profile | Post
  score: number
  threshold: number
}
