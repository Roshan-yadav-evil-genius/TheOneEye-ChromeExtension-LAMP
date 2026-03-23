import { create } from "zustand"

import type { PostScoringSettings, ProfileScoringSettings } from "@/types/extension-settings"
import {
  DEFAULT_POST_SCORING,
  DEFAULT_PROFILE_SCORING,
} from "../../shared/scoring-settings-defaults.ts"

export {
  DEFAULT_POST_SCORING,
  DEFAULT_PROFILE_SCORING,
  mergePostScoring,
  mergeProfileScoring,
} from "../../shared/scoring-settings-defaults.ts"

interface ScoringSettingsState {
  profile: ProfileScoringSettings
  post: PostScoringSettings
  setProfile: (patch: Partial<ProfileScoringSettings>) => void
  setPost: (patch: Partial<PostScoringSettings>) => void
}

export const useScoringSettingsStore = create<ScoringSettingsState>((set) => ({
  profile: DEFAULT_PROFILE_SCORING,
  post: DEFAULT_POST_SCORING,
  setProfile: (patch) =>
    set((s) => ({ profile: { ...s.profile, ...patch } })),
  setPost: (patch) => set((s) => ({ post: { ...s.post, ...patch } })),
}))
