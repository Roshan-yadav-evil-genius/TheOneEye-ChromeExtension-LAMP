import { create } from "zustand"

import type { PostScoringSettings, ProfileScoringSettings } from "@/types/extension-settings"

interface ScoringSettingsState {
  profile: ProfileScoringSettings
  post: PostScoringSettings
  setProfile: (patch: Partial<ProfileScoringSettings>) => void
  setPost: (patch: Partial<PostScoringSettings>) => void
}

/** Defaults when profile + post intentions are in use (recommended starting point). */
export const DEFAULT_PROFILE_SCORING: ProfileScoringSettings = {
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

export const DEFAULT_POST_SCORING: PostScoringSettings = {
  sectionEnabled: true,
  threshold: 5,
  autoscore: true,
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

export const useScoringSettingsStore = create<ScoringSettingsState>((set) => ({
  profile: DEFAULT_PROFILE_SCORING,
  post: DEFAULT_POST_SCORING,
  setProfile: (patch) =>
    set((s) => ({ profile: { ...s.profile, ...patch } })),
  setPost: (patch) => set((s) => ({ post: { ...s.post, ...patch } })),
}))
