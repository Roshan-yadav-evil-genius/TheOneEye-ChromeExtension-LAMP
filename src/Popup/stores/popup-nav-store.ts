import { create } from "zustand"

import type { DashboardView, IntentionView, PrimaryTab } from "@/types/extension-settings"

export type { DashboardView, IntentionView, PrimaryTab }

/** Primary tab and sub-view state for the popup shell (not persisted). */
interface PopupNavState {
  primary: PrimaryTab
  dashboardView: DashboardView
  intentionView: IntentionView
  setPrimary: (tab: PrimaryTab) => void
  setDashboardView: (view: DashboardView) => void
  setIntentionView: (view: IntentionView) => void
}

/** Zustand store for which popup panel and dashboard/intention sub-view is active. */
export const usePopupNavStore = create<PopupNavState>((set) => ({
  primary: "dashboard",
  dashboardView: "posts",
  intentionView: "profile",
  setPrimary: (tab) => set({ primary: tab }),
  setDashboardView: (view) => set({ dashboardView: view }),
  setIntentionView: (view) => set({ intentionView: view }),
}))
