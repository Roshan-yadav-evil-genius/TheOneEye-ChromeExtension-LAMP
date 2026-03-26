import {
  BarChart3,
  FileText,
  Heading,
  Star,
  Tag,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  type DashboardView,
  type IntentionView,
  usePopupNavStore,
} from "@/stores/popup-nav-store"

const DASHBOARD_ITEMS: {
  id: DashboardView
  label: string
  icon: typeof FileText
}[] = [
  { id: "posts", label: "Posts", icon: FileText },
  { id: "profiles", label: "Profiles", icon: User },
  { id: "qualified", label: "Qualified", icon: Star },
  { id: "stats", label: "Stats", icon: BarChart3 },
]

const INTENTION_ITEMS: {
  id: IntentionView
  label: string
  icon: typeof User
}[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "headline", label: "Headline", icon: Heading },
  { id: "post", label: "Post", icon: FileText },
  { id: "keywords", label: "Keywords", icon: Tag },
]

/** Secondary nav for dashboard sub-views and intention sub-views. */
export function PopupSidebar() {
  const primary = usePopupNavStore((s) => s.primary)
  const dashboardView = usePopupNavStore((s) => s.dashboardView)
  const intentionView = usePopupNavStore((s) => s.intentionView)
  const setDashboardView = usePopupNavStore((s) => s.setDashboardView)
  const setIntentionView = usePopupNavStore((s) => s.setIntentionView)

  if (primary === "dashboard") {
    return (
      <aside
        className="flex h-full min-h-0 w-28 shrink-0 flex-col gap-0.5 self-stretch border-r border-border py-2 pl-1 pr-1"
        aria-label="Section"
      >
        {DASHBOARD_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = dashboardView === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setDashboardView(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-[0.65rem] font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </aside>
    )
  }

  if (primary === "intention") {
    return (
      <aside
        className="flex h-full min-h-0 w-28 shrink-0 flex-col gap-0.5 self-stretch border-r border-border py-2 pl-1 pr-1"
        aria-label="Section"
      >
        {INTENTION_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = intentionView === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setIntentionView(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-[0.65rem] font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </aside>
    )
  }

  return null
}
