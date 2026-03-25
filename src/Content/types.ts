export interface Profile {
  url: string
  avatar: string[]
  name: string
  headline: string
}

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

export type MarkerKind = "profile" | "post"

export type MarkerInteractionPayload =
  | { id: string; kind: "profile"; data: Profile }
  | { id: string; kind: "post"; data: Post }

export type MarkerDomState = "default" | "loading" | "score" | "error"

export type MarkerVisualUpdate =
  | { state: "default" }
  | { state: "loading" }
  | { state: "score"; score: number; threshold?: number }
  | { state: "error" }
