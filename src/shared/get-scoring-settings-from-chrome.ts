import type {
  PostScoringSettings,
  ProfileScoringSettings,
} from "../Popup/types/extension-settings.ts"

import { isExtensionContextInvalidatedError } from "./chrome-context-errors.ts"
import {
  SETTINGS_POST_SCORING,
  SETTINGS_PROFILE_SCORING,
} from "./scoring-storage-keys.ts"
import {
  DEFAULT_POST_SCORING,
  DEFAULT_PROFILE_SCORING,
} from "./scoring-settings-defaults.ts"

const THRESHOLD_MIN = 1
const THRESHOLD_MAX = 100

function clampThreshold(n: number): number {
  return Math.min(THRESHOLD_MAX, Math.max(THRESHOLD_MIN, Math.round(n)))
}

function mergeProfile(
  partial?: Partial<ProfileScoringSettings>
): ProfileScoringSettings {
  const m = { ...DEFAULT_PROFILE_SCORING, ...partial }
  m.threshold = clampThreshold(m.threshold)
  return m
}

function mergePost(partial?: Partial<PostScoringSettings>): PostScoringSettings {
  const m = { ...DEFAULT_POST_SCORING, ...partial }
  m.threshold = clampThreshold(m.threshold)
  return m
}

export type ScoringSettingsBundle = {
  profile: ProfileScoringSettings
  post: PostScoringSettings
}

/**
 * Full profile/post scoring settings from chrome.storage.local (merged defaults,
 * clamped thresholds). Same persistence shape as the popup scoring store.
 */
export async function getScoringSettingsFromChrome(): Promise<ScoringSettingsBundle> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return {
      profile: mergeProfile(),
      post: mergePost(),
    }
  }

  try {
    const raw = await chrome.storage.local.get([
      SETTINGS_PROFILE_SCORING,
      SETTINGS_POST_SCORING,
    ])

    let profilePartial: Partial<ProfileScoringSettings> | undefined
    const p = raw[SETTINGS_PROFILE_SCORING]
    if (p && typeof p === "object" && !Array.isArray(p)) {
      profilePartial = p as Partial<ProfileScoringSettings>
    }

    let postPartial: Partial<PostScoringSettings> | undefined
    const po = raw[SETTINGS_POST_SCORING]
    if (po && typeof po === "object" && !Array.isArray(po)) {
      postPartial = po as Partial<PostScoringSettings>
    }

    return {
      profile: mergeProfile(profilePartial),
      post: mergePost(postPartial),
    }
  } catch (e) {
    if (isExtensionContextInvalidatedError(e)) {
      return {
        profile: mergeProfile({ sectionEnabled: false }),
        post: mergePost({ sectionEnabled: false }),
      }
    }
    throw e
  }
}

/** Whether profile/post scoring sections are enabled (markers may be shown). */
export async function getScoringSectionEnabledFromChrome(): Promise<{
  profile: boolean
  post: boolean
}> {
  const s = await getScoringSettingsFromChrome()
  return {
    profile: s.profile.sectionEnabled,
    post: s.post.sectionEnabled,
  }
}
