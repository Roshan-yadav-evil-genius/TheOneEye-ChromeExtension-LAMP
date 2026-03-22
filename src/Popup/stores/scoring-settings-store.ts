import { create } from "zustand"

import type { PostScoringSettings, ProfileScoringSettings } from "@/types/extension-settings"

interface ScoringSettingsState {
  profile: ProfileScoringSettings
  post: PostScoringSettings
  setProfile: (patch: Partial<ProfileScoringSettings>) => void
  setPost: (patch: Partial<PostScoringSettings>) => void
}

const defaultProfile: ProfileScoringSettings = {
  sectionEnabled: true,
  threshold: 5,
  autoscore: false,
  headline: true,
  about: true,
  activity: true,
  activityPublished: true,
  activityReacted: true,
  activityCommented: true,
  useCache: true,
}

const defaultPost: PostScoringSettings = {
  sectionEnabled: true,
  threshold: 5,
  autoscore: false,
}

export const useScoringSettingsStore = create<ScoringSettingsState>((set) => ({
  profile: defaultProfile,
  post: defaultPost,
  setProfile: (patch) =>
    set((s) => ({ profile: { ...s.profile, ...patch } })),
  setPost: (patch) => set((s) => ({ post: { ...s.post, ...patch } })),
}))
