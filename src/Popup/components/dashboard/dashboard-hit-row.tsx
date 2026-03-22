import { Check, User, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { openUrlInNewTab } from "@/lib/open-url-new-tab"
import { cn } from "@/lib/utils"
import type { Profile } from "../../../Content/types.ts"

type Props = {
  profile: Profile
  onDrop: () => void
  onQualify?: () => void
  showQualify?: boolean
  className?: string
}

export function DashboardHitRow({
  profile,
  onDrop,
  onQualify,
  showQualify = true,
  className,
}: Props) {
  const [avatarFailed, setAvatarFailed] = useState(false)
  const avatarUrl = profile.avatar.at(-1)
  const showImage = Boolean(avatarUrl) && !avatarFailed
  const profileUrl = profile.url.trim()
  const canOpenProfile = profileUrl.length > 0

  return (
    <div
      className={cn(
        "flex min-h-12 items-center gap-2 rounded-md border border-border bg-card/40 px-2 py-1.5",
        className
      )}
    >
      <button
        type="button"
        disabled={!canOpenProfile}
        onClick={() => openUrlInNewTab(profile.url)}
        className={cn(
          "flex min-h-0 min-w-0 flex-1 items-center gap-2 rounded-md text-left outline-none transition-colors",
          canOpenProfile
            ? "cursor-pointer hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
            : "cursor-default opacity-90"
        )}
        aria-label={
          canOpenProfile
            ? `Open ${profile.name || "profile"} in new tab`
            : "Profile link unavailable"
        }
      >
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
          {showImage ? (
            <img
              src={avatarUrl}
              alt=""
              className="size-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <User className="size-5" aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium leading-tight text-foreground">
            {profile.name || "—"}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-snug text-muted-foreground">
            {profile.headline || "—"}
          </p>
        </div>
      </button>
      <div className="flex shrink-0 flex-col gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onDrop}
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </Button>
        {showQualify && onQualify ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onQualify}
            aria-label="Qualify"
          >
            <Check className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
