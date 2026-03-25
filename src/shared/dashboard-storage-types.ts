import type { Post, Profile } from "../Content/types.ts"

/** Single dashboard row: profile or post that met the user’s score threshold. */
export type DashboardThresholdHit =
  | {
      id: string
      scoredAt: number
      score: number
      threshold: number
      source: "profile"
      profile: Profile
    }
  | {
      id: string
      scoredAt: number
      score: number
      threshold: number
      source: "post"
      post: Post
    }

/** Manually qualified profile row for the qualified-profiles list. */
export type DashboardQualifiedRow = {
  id: string
  qualifiedAt: number
  profile: Profile
}

/** Legacy persisted shape (no `source`) — used only for migration */
export type DashboardPostHitLegacy = {
  id: string
  scoredAt: number
  score: number
  threshold: number
  post: Post
}

export type DashboardProfileHitLegacy = {
  id: string
  scoredAt: number
  score: number
  threshold: number
  profile: Profile
}
