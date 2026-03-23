import { create } from "zustand"

import { clearThresholdHitsPreservingQualified } from "@/lib/dashboard-lists-storage"
import { getLampStorageBytesInUse } from "@/lib/lamp-storage-byte-size"
import { resetStatsLifetimeInChrome } from "@/lib/stats-lifetime-storage"
import type { StatsLifetimeBlob } from "../../shared/stats-lifetime-types.ts"
import type { DashboardStatsSnapshot } from "@/types/extension-settings"

type LifetimeSlice = Pick<
  DashboardStatsSnapshot,
  | "profilesScored"
  | "relevantProfiles"
  | "postsScored"
  | "relevantPosts"
>

interface StatsState extends LifetimeSlice {
  storageBytesUsed: number
  hydrateLifetime: (blob: StatsLifetimeBlob) => void
  setStorageBytesUsed: (bytes: number) => void
  reset: () => void
}

const lifetimeZeros: LifetimeSlice = {
  profilesScored: 0,
  relevantProfiles: 0,
  postsScored: 0,
  relevantPosts: 0,
}

export const useStatsStore = create<StatsState>((set) => ({
  ...lifetimeZeros,
  storageBytesUsed: 0,
  hydrateLifetime: (blob) =>
    set({
      profilesScored: blob.profilesScored,
      relevantProfiles: blob.relevantProfiles,
      postsScored: blob.postsScored,
      relevantPosts: blob.relevantPosts,
    }),
  setStorageBytesUsed: (bytes) =>
    set({ storageBytesUsed: Number.isFinite(bytes) ? Math.max(0, bytes) : 0 }),
  reset: () => {
    void (async () => {
      await Promise.all([
        resetStatsLifetimeInChrome(),
        clearThresholdHitsPreservingQualified(),
      ])
      const bytes = await getLampStorageBytesInUse()
      set({ ...lifetimeZeros, storageBytesUsed: bytes })
    })()
  },
}))
