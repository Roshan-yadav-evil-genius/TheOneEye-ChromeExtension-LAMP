import {
  readIntentionFromChrome,
  readScoringSettingsFromChrome,
  writeIntentionToChrome,
  writeScoringSettingsToChrome,
} from "@/lib/chrome-popup-storage"
import {
  mergeDashboardListsAppend,
  readDashboardLists,
} from "@/lib/dashboard-lists-storage"
import { clampScoringToIntention } from "@/lib/clamp-scoring-to-intention"
import { parseLampMigrationFile } from "@/lib/lamp-migration-parse"
import { useIntentionStore } from "@/stores/intention-store"
import {
  mergePostScoring,
  mergeProfileScoring,
  useScoringSettingsStore,
} from "@/stores/scoring-settings-store"
import {
  DASHBOARD_QUALIFIED,
  DASHBOARD_THRESHOLD_HITS,
} from "@/constants/popup-storage-keys"
import {
  serializeLampMigration,
  LAMP_MIGRATION_VERSION,
  type LampMigrationPayload,
} from "../../shared/lamp-migration.ts"

export type LampMigrationImportOptions = {
  intention: boolean
  settings: boolean
  dashboard: boolean
}

export type LampMigrationIoResult =
  | { ok: true }
  | { ok: false; error: string }

function isChromeStorageAvailable(): boolean {
  return typeof chrome !== "undefined" && !!chrome.storage?.local
}

/** Builds a JSON blob of intentions, scoring settings, and dashboard lists. */
export async function exportLampMigrationToBlob(): Promise<Blob> {
  if (!isChromeStorageAvailable()) {
    return new Blob(
      [
        serializeLampMigration({
          version: LAMP_MIGRATION_VERSION,
          exportedAt: new Date().toISOString(),
          intention: {
            profileDescription: "",
            postDescription: "",
            keywords: [],
            headlineTags: [],
          },
          settings: {
            profile: mergeProfileScoring(undefined),
            post: mergePostScoring(undefined),
          },
          dashboard: { thresholdHits: [], qualified: [] },
        }),
      ],
      { type: "application/json" }
    )
  }

  const [intentionPartial, scoringPartial, lists] = await Promise.all([
    readIntentionFromChrome(),
    readScoringSettingsFromChrome(),
    readDashboardLists(),
  ])

  const payload: LampMigrationPayload = {
    version: LAMP_MIGRATION_VERSION,
    exportedAt: new Date().toISOString(),
    intention: {
      profileDescription: intentionPartial.profileDescription ?? "",
      postDescription: intentionPartial.postDescription ?? "",
      keywords: intentionPartial.keywords ?? [],
      headlineTags: intentionPartial.headlineTags ?? [],
    },
    settings: {
      profile: mergeProfileScoring(scoringPartial.profile),
      post: mergePostScoring(scoringPartial.post),
    },
    dashboard: {
      thresholdHits: lists.thresholdHits,
      qualified: lists.qualified,
    },
  }

  return new Blob([serializeLampMigration(payload)], {
    type: "application/json",
  })
}

/**
 * Applies a validated migration file per section. Validates the full file before writing anything.
 */
export async function applyLampMigrationImport(
  text: string,
  options: LampMigrationImportOptions
): Promise<LampMigrationIoResult> {
  if (!options.intention && !options.settings && !options.dashboard) {
    return { ok: false, error: "Select at least one import option." }
  }

  const parsed = parseLampMigrationFile(text)
  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }

  if (!isChromeStorageAvailable()) {
    return { ok: false, error: "Storage is not available." }
  }

  const { payload } = parsed

  if (options.intention) {
    await writeIntentionToChrome({
      profileDescription: payload.intention.profileDescription,
      postDescription: payload.intention.postDescription,
      keywords: payload.intention.keywords,
      headlineTags: payload.intention.headlineTags,
    })
    useIntentionStore.setState({
      profileDescription: payload.intention.profileDescription,
      postDescription: payload.intention.postDescription,
      keywords: payload.intention.keywords,
      headlineTags: payload.intention.headlineTags,
    })
  }

  if (options.settings) {
    await writeScoringSettingsToChrome({
      profile: payload.settings.profile,
      post: payload.settings.post,
    })
    useScoringSettingsStore.setState({
      profile: payload.settings.profile,
      post: payload.settings.post,
    })
  }

  if (options.dashboard) {
    const lists = await readDashboardLists()
    const merged = mergeDashboardListsAppend(
      lists.thresholdHits,
      lists.qualified,
      payload.dashboard.thresholdHits,
      payload.dashboard.qualified
    )
    await chrome.storage.local.set({
      [DASHBOARD_THRESHOLD_HITS]: merged.thresholdHits,
      [DASHBOARD_QUALIFIED]: merged.qualified,
    })
  }

  if (options.intention || options.settings) {
    clampScoringToIntention()
  }

  return { ok: true }
}
