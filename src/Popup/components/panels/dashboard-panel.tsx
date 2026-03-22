import {
  Database,
  FileCheck,
  FileText,
  User,
  UserCheck,
} from "lucide-react"

import { StatRow } from "@/components/dashboard/stat-row"
import { Button } from "@/components/ui/button"
import { usePopupNavStore } from "@/stores/popup-nav-store"
import { useStatsStore } from "@/stores/stats-store"

const EMPTY_COPY: Record<
  "posts" | "profiles" | "qualified",
  { title: string; hint: string }
> = {
  posts: {
    title: "Posts",
    hint: "Profiles whose posts scored above threshold — mark as qualified or dismiss.",
  },
  profiles: {
    title: "Profiles",
    hint: "Profiles scored against your intention — review and qualify.",
  },
  qualified: {
    title: "Qualified",
    hint: "Profiles you marked as qualified appear here.",
  },
}

export function DashboardPanel() {
  const view = usePopupNavStore((s) => s.dashboardView)
  const profilesScored = useStatsStore((s) => s.profilesScored)
  const relevantProfiles = useStatsStore((s) => s.relevantProfiles)
  const postsScored = useStatsStore((s) => s.postsScored)
  const relevantPosts = useStatsStore((s) => s.relevantPosts)
  const profilesInCache = useStatsStore((s) => s.profilesInCache)
  const reset = useStatsStore((s) => s.reset)

  if (view === "stats") {
    return (
      <div className="flex min-h-0 flex-col gap-2">
        <div className="flex flex-col gap-1.5">
          <StatRow icon={User} label="Profiles scored" value={profilesScored} />
          <StatRow
            icon={UserCheck}
            label="Relevant profiles"
            value={relevantProfiles}
          />
          <StatRow icon={FileText} label="Posts scored" value={postsScored} />
          <StatRow
            icon={FileCheck}
            label="Relevant posts"
            value={relevantPosts}
          />
          <StatRow
            icon={Database}
            label="Profiles in cache"
            value={profilesInCache}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-1 w-full"
          size="sm"
          onClick={() => reset()}
        >
          Reset
        </Button>
      </div>
    )
  }

  const { title, hint } = EMPTY_COPY[view]

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <p className="text-[0.65rem] leading-snug text-muted-foreground">
        {hint}
      </p>
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border py-8">
        <p className="text-xs font-medium text-muted-foreground">None yet</p>
        <p className="mt-0.5 text-[0.65rem] text-muted-foreground/80">
          {title}
        </p>
      </div>
    </div>
  )
}
