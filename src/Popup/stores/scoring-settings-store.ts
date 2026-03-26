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

/** Profile and post scoring toggles and thresholds (persisted via initPopupStorage). */
interface ScoringSettingsState {
  profile: ProfileScoringSettings
  post: PostScoringSettings
  setProfile: (patch: Partial<ProfileScoringSettings>) => void
  setPost: (patch: Partial<PostScoringSettings>) => void
}

/** Zustand store for scoring settings merged with shared defaults on hydrate. */
export const useScoringSettingsStore = create<ScoringSettingsState>((set) => ({
  profile: DEFAULT_PROFILE_SCORING,
  post: DEFAULT_POST_SCORING,
  setProfile: (patch) =>
    set((s) => ({ profile: { ...s.profile, ...patch } })),
  setPost: (patch) => set((s) => ({ post: { ...s.post, ...patch } })),
}))
