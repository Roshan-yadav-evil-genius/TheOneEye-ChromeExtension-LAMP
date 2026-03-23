import type {
  PostScoringSettings,
  ProfileScoringSettings,
} from "../Popup/types/extension-settings.ts"

/**
 * Single source of truth for scoring defaults (popup, content, service worker, install).
 * - Autoscore off until the user turns it on.
 * - Profile: headline only by default; About and Activity off.
 */
export const DEFAULT_PROFILE_SCORING: ProfileScoringSettings = {
  sectionEnabled: true,
  threshold: 8,
  autoscore: false,
  headline: true,
  about: false,
  activity: false,
  activityPublished: false,
  activityReacted: false,
  activityCommented: false,
  useCache: true,
}

export const DEFAULT_POST_SCORING: PostScoringSettings = {
  sectionEnabled: true,
  threshold: 5,
  autoscore: false,
}

export function mergeProfileScoring(
  partial?: Partial<ProfileScoringSettings>
): ProfileScoringSettings {
  return { ...DEFAULT_PROFILE_SCORING, ...partial }
}

export function mergePostScoring(
  partial?: Partial<PostScoringSettings>
): PostScoringSettings {
  return { ...DEFAULT_POST_SCORING, ...partial }
}
