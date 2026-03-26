import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatRowProps {
  icon: LucideIcon
  label: string
  value: number | string
  className?: string
}

/** Single labeled metric row with icon for the stats dashboard card. */
export function StatRow({ icon: Icon, label, value, className }: StatRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card/50 px-2.5 py-2",
        className
      )}
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-xs text-foreground">
        {label}
      </span>
      <span className="shrink-0 tabular-nums text-xs font-semibold text-foreground">
        {value}
      </span>
    </div>
  )
}
