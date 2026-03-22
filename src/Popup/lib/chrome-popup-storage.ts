import type { PostScoringSettings, ProfileScoringSettings } from "@/types/extension-settings"

import {
  INTENTION_KEYWORDS,
  INTENTION_POST,
  INTENTION_PROFILE,
  SETTINGS_POST_SCORING,
  SETTINGS_PROFILE_SCORING,
} from "@/constants/popup-storage-keys"

export function isChromeStorageAvailable(): boolean {
  return typeof chrome !== "undefined" && !!chrome.storage?.local
}

type IntentionStored = {
  [INTENTION_PROFILE]: string
  [INTENTION_POST]: string
  [INTENTION_KEYWORDS]: string[]
}

type SettingsStored = {
  [SETTINGS_PROFILE_SCORING]: ProfileScoringSettings
  [SETTINGS_POST_SCORING]: PostScoringSettings
}

export async function readIntentionFromChrome(): Promise<
  Partial<{ profileDescription: string; postDescription: string; keywords: string[] }>
> {
  if (!isChromeStorageAvailable()) return {}
  const keys: string[] = [
    INTENTION_PROFILE,
    INTENTION_POST,
    INTENTION_KEYWORDS,
  ]
  const raw = await chrome.storage.local.get(keys)
  const out: Partial<{
    profileDescription: string
    postDescription: string
    keywords: string[]
  }> = {}
  if (typeof raw[INTENTION_PROFILE] === "string") {
    out.profileDescription = raw[INTENTION_PROFILE]
  }
  if (typeof raw[INTENTION_POST] === "string") {
    out.postDescription = raw[INTENTION_POST]
  }
  if (Array.isArray(raw[INTENTION_KEYWORDS])) {
    out.keywords = raw[INTENTION_KEYWORDS].filter(
      (k): k is string => typeof k === "string"
    )
  }
  return out
}

export async function writeIntentionToChrome(payload: {
  profileDescription: string
  postDescription: string
  keywords: string[]
}): Promise<void> {
  if (!isChromeStorageAvailable()) return
  const record: IntentionStored = {
    [INTENTION_PROFILE]: payload.profileDescription,
    [INTENTION_POST]: payload.postDescription,
    [INTENTION_KEYWORDS]: payload.keywords,
  }
  await chrome.storage.local.set(record)
}

export async function readScoringSettingsFromChrome(): Promise<{
  profile?: Partial<ProfileScoringSettings>
  post?: Partial<PostScoringSettings>
}> {
  if (!isChromeStorageAvailable()) return {}
  const keys: string[] = [SETTINGS_PROFILE_SCORING, SETTINGS_POST_SCORING]
  const raw = (await chrome.storage.local.get(keys)) as Record<
    string,
    unknown
  >
  const out: {
    profile?: Partial<ProfileScoringSettings>
    post?: Partial<PostScoringSettings>
  } = {}
  const p = raw[SETTINGS_PROFILE_SCORING]
  if (p && typeof p === "object" && !Array.isArray(p)) {
    out.profile = p as Partial<ProfileScoringSettings>
  }
  const po = raw[SETTINGS_POST_SCORING]
  if (po && typeof po === "object" && !Array.isArray(po)) {
    out.post = po as Partial<PostScoringSettings>
  }
  return out
}

export async function writeScoringSettingsToChrome(payload: {
  profile: ProfileScoringSettings
  post: PostScoringSettings
}): Promise<void> {
  if (!isChromeStorageAvailable()) return
  const record: SettingsStored = {
    [SETTINGS_PROFILE_SCORING]: payload.profile,
    [SETTINGS_POST_SCORING]: payload.post,
  }
  await chrome.storage.local.set(record)
}
