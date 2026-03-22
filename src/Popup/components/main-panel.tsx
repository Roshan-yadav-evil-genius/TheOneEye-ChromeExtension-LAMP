import { DashboardPanel } from "@/components/panels/dashboard-panel"
import { IntentionPanel } from "@/components/panels/intention-panel"
import { ReportPanel } from "@/components/panels/report-panel"
import { SettingsPanel } from "@/components/panels/settings-panel"
import { usePopupNavStore } from "@/stores/popup-nav-store"

export function MainPanel() {
  const primary = usePopupNavStore((s) => s.primary)

  switch (primary) {
    case "dashboard":
      return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <DashboardPanel />
        </div>
      )
    case "intention":
      return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <IntentionPanel />
        </div>
      )
    case "settings":
      return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <SettingsPanel />
        </div>
      )
    case "report":
      return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <ReportPanel />
        </div>
      )
    default:
      return null
  }
}
