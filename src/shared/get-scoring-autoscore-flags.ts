import type {
  PostScoringSettings,
  ProfileScoringSettings,
} from "../Popup/types/extension-settings.ts"

/** Must match [scoring-storage-keys.ts](scoring-storage-keys.ts); inlined for content bundle. */
const SETTINGS_PROFILE_SCORING = "settings_profile_scoring" as const
const SETTINGS_POST_SCORING = "settings_post_scoring" as const

/** Align with `DEFAULT_PROFILE_SCORING` / `DEFAULT_POST_SCORING` in popup store. */
const DEFAULT_PROFILE: ProfileScoringSettings = {
  sectionEnabled: true,
  threshold: 8,
  autoscore: true,
  headline: true,
  about: true,
  activity: false,
  activityPublished: false,
  activityReacted: false,
  activityCommented: false,
  useCache: true,
}

const DEFAULT_POST: PostScoringSettings = {
  sectionEnabled: true,
  threshold: 5,
  autoscore: true,
}

function mergeProfile(
  partial?: Partial<ProfileScoringSettings>
): ProfileScoringSettings {
  return { ...DEFAULT_PROFILE, ...partial }
}

function mergePost(partial?: Partial<PostScoringSettings>): PostScoringSettings {
  return { ...DEFAULT_POST, ...partial }
}

export async function getScoringAutoscoreFlagsFromChrome(): Promise<{
  profile: boolean
  post: boolean
}> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return {
      profile: DEFAULT_PROFILE.sectionEnabled && DEFAULT_PROFILE.autoscore,
      post: DEFAULT_POST.sectionEnabled && DEFAULT_POST.autoscore,
    }
  }

  const raw = await chrome.storage.local.get([
    SETTINGS_PROFILE_SCORING,
    SETTINGS_POST_SCORING,
  ])

  const profileSettings = mergeProfile(
    raw[SETTINGS_PROFILE_SCORING] as Partial<ProfileScoringSettings> | undefined
  )
  const postSettings = mergePost(
    raw[SETTINGS_POST_SCORING] as Partial<PostScoringSettings> | undefined
  )

  return {
    profile: profileSettings.sectionEnabled && profileSettings.autoscore,
    post: postSettings.sectionEnabled && postSettings.autoscore,
  }
}
