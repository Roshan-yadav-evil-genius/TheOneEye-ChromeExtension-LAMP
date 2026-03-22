import { create } from "zustand"

import type { DashboardStatsSnapshot } from "@/types/extension-settings"

interface StatsState extends DashboardStatsSnapshot {
  reset: () => void
}

const initial: DashboardStatsSnapshot = {
  profilesScored: 78,
  relevantProfiles: 2,
  postsScored: 368,
  relevantPosts: 0,
  profilesInCache: 1,
}

export const useStatsStore = create<StatsState>((set) => ({
  ...initial,
  reset: () => set({ ...initial }),
}))
