import type { DashboardQualifiedRow, DashboardThresholdHit } from "./dashboard-storage-types.ts"
import type {
  IntentionPayload,
  PostScoringSettings,
  ProfileScoringSettings,
} from "../Popup/types/extension-settings.ts"

/** Bump when the JSON envelope or required fields change. */
export const LAMP_MIGRATION_VERSION = 1 as const

/** Versioned backup / restore bundle for chrome.storage-backed popup data. */
export type LampMigrationPayload = {
  version: typeof LAMP_MIGRATION_VERSION
  exportedAt: string
  intention: IntentionPayload
  settings: {
    profile: ProfileScoringSettings
    post: PostScoringSettings
  }
  dashboard: {
    thresholdHits: DashboardThresholdHit[]
    qualified: DashboardQualifiedRow[]
  }
}

export function serializeLampMigration(payload: LampMigrationPayload): string {
  return JSON.stringify(payload, null, 2)
}
