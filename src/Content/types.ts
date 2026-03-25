/** LinkedIn profile fields extracted for scoring and dashboard display. */
export interface Profile {
  url: string
  avatar: string[]
  name: string
  headline: string
}

/** Feed post with embedded publisher profile for post-level scoring. */
export interface Post {
  publisher: Profile
  post: {
    content: string | null
    image: string[],
    postedDateIso: string | null
  }
}

/** One marker attachment produced by a parser; executor applies section flags. */
export type ParsedMarkerInstruction =
  | {
      kind: "profile"
      anchor: HTMLElement
      data: Profile
      float?: boolean
    }
  | {
      kind: "post"
      anchor: HTMLElement
      data: Post
      float?: boolean
    }

/** Gating for marker placement from scoring settings `sectionEnabled`. */
export type ScoringSectionFlags = {
  profile: boolean
  post: boolean
}

/** Which entity type a DOM marker represents. */
export type MarkerKind = "profile" | "post"

/** Payload emitted when the user activates a placed marker button. */
export type MarkerInteractionPayload =
  | { id: string; kind: "profile"; data: Profile }
  | { id: string; kind: "post"; data: Post }

/** Visual state reflected on the marker button and `data-marker-state`. */
export type MarkerDomState = "default" | "loading" | "score" | "error"

/** Instruction to update marker appearance (spinner, score chip, error). */
export type MarkerVisualUpdate =
  | { state: "default" }
  | { state: "loading" }
  | { state: "score"; score: number; threshold?: number }
  | { state: "error" }
