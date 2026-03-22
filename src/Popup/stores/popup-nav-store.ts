import { create } from "zustand"

import type { DashboardView, IntentionView, PrimaryTab } from "@/types/extension-settings"

export type { DashboardView, IntentionView, PrimaryTab }

interface PopupNavState {
  primary: PrimaryTab
  dashboardView: DashboardView
  intentionView: IntentionView
  setPrimary: (tab: PrimaryTab) => void
  setDashboardView: (view: DashboardView) => void
  setIntentionView: (view: IntentionView) => void
}

export const usePopupNavStore = create<PopupNavState>((set) => ({
  primary: "dashboard",
  dashboardView: "posts",
  intentionView: "profile",
  setPrimary: (tab) => set({ primary: tab }),
  setDashboardView: (view) => set({ dashboardView: view }),
  setIntentionView: (view) => set({ intentionView: view }),
}))
