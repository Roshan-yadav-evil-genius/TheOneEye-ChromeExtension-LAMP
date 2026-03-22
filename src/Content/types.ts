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

export interface LinkedInParseResult {
  mynetworkProfiles: Profile[]
  recommendedProfiles: Profile[]
  searchResultsProfiles: Profile[]
  posts: Post[]
}

export type MarkerKind = "profile" | "post"

export type MarkerInteractionPayload =
  | { id: string; kind: "profile"; data: Profile }
  | { id: string; kind: "post"; data: Post }

export type MarkerVisualUpdate =
  | { state: "default" }
  | { state: "loading" }
  | { state: "score"; score: number; threshold?: number }
