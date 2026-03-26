import {
  DASHBOARD_POST_HITS,
  DASHBOARD_PROFILE_HITS,
  DASHBOARD_QUALIFIED,
  DASHBOARD_THRESHOLD_HITS,
} from "./dashboard-storage-keys.ts"
import { PROFILE_SCORE_CACHE } from "./profile-score-cache-storage-key.ts"
import {
  SETTINGS_POST_SCORING,
  SETTINGS_PROFILE_SCORING,
} from "./scoring-storage-keys.ts"
import {
  DEFAULT_POST_SCORING,
  DEFAULT_PROFILE_SCORING,
} from "./scoring-settings-defaults.ts"
import { STATS_LIFETIME_DEFAULT } from "./stats-lifetime-types.ts"
import { STATS_LIFETIME } from "./stats-storage-keys.ts"

/** Align with [popup-storage-keys.ts](../Popup/constants/popup-storage-keys.ts). */
const INTENTION_PROFILE = "intention_profile" as const
const INTENTION_POST = "intention_post" as const
const INTENTION_KEYWORDS = "intention_keywords" as const
const INTENTION_HEADLINE_TAGS = "intention_headline_tags" as const

/** Fresh install: same defaults as [scoring-settings-defaults.ts](scoring-settings-defaults.ts), sections off until intention exists. */
const INSTALL_PROFILE_SCORING = {
  ...DEFAULT_PROFILE_SCORING,
  sectionEnabled: false,
} satisfies typeof DEFAULT_PROFILE_SCORING

const INSTALL_POST_SCORING = {
  ...DEFAULT_POST_SCORING,
  sectionEnabled: false,
} satisfies typeof DEFAULT_POST_SCORING

/**
 * Builds the full chrome.storage.local payload for a fresh install.
 *
 * @remarks Keys must stay aligned with lamp-storage-key-list.ts.
 */
export function getExtensionInstallLocalStorageRecord(): Record<string, unknown> {
  return {
    [INTENTION_PROFILE]: "",
    [INTENTION_POST]: "",
    [INTENTION_KEYWORDS]: [] as string[],
    [INTENTION_HEADLINE_TAGS]: [] as string[],
    [SETTINGS_PROFILE_SCORING]: INSTALL_PROFILE_SCORING,
    [SETTINGS_POST_SCORING]: INSTALL_POST_SCORING,
    [PROFILE_SCORE_CACHE]: {} as Record<string, number>,
    [DASHBOARD_THRESHOLD_HITS]: [],
    [DASHBOARD_QUALIFIED]: [],
    [DASHBOARD_POST_HITS]: [],
    [DASHBOARD_PROFILE_HITS]: [],
    [STATS_LIFETIME]: { ...STATS_LIFETIME_DEFAULT },
  }
}

/**
 * Writes the full first-install chrome.storage.local snapshot (idempotent use on install).
 *
 * @remarks Persists all keys listed in getExtensionInstallLocalStorageRecord.
 */
export async function writeExtensionInstallDefaultsToChrome(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) return
  await chrome.storage.local.set(getExtensionInstallLocalStorageRecord())
}
