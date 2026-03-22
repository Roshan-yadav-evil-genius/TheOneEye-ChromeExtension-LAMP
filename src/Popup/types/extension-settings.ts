/**
 * Shapes aligned for future backend / API sync. Field names mirror the popup domain model.
 */

export type PrimaryTab = "dashboard" | "intention" | "settings" | "report"

export type DashboardView = "posts" | "profiles" | "qualified" | "stats"

export type IntentionView = "profile" | "post" | "keywords"

export interface DashboardStatsSnapshot {
  profilesScored: number
  relevantProfiles: number
  postsScored: number
  relevantPosts: number
  /** Row count sum from dashboard lists; computed in UI, not persisted. */
  profilesInCache: number
  /** Bytes for Lamp-owned chrome.storage.local keys. */
  storageBytesUsed: number
}

export interface ProfileScoringSettings {
  sectionEnabled: boolean
  /** Relevance cutoff; UI uses 1–100. */
  threshold: number
  autoscore: boolean
  headline: boolean
  about: boolean
  activity: boolean
  activityPublished: boolean
  activityReacted: boolean
  activityCommented: boolean
  useCache: boolean
}

export interface PostScoringSettings {
  sectionEnabled: boolean
  /** Relevance cutoff; UI uses 1–100. */
  threshold: number
  autoscore: boolean
}

export interface IntentionPayload {
  profileDescription: string
  postDescription: string
  keywords: string[]
}

export interface ReportIssuePayload {
  description: string
}
