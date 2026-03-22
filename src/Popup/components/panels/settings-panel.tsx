import {
  AlertTriangle,
  BarChart2,
  FileText,
  Moon,
  TextCursorInput,
  User,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useScoringSettingsStore } from "@/stores/scoring-settings-store"
import { cn } from "@/lib/utils"

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  icon: LucideIcon
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <Icon
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
      <span className="min-w-0 flex-1 text-[0.65rem] text-foreground">
        {label}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  )
}

export function SettingsPanel() {
  const profile = useScoringSettingsStore((s) => s.profile)
  const post = useScoringSettingsStore((s) => s.post)
  const setProfile = useScoringSettingsStore((s) => s.setProfile)
  const setPost = useScoringSettingsStore((s) => s.setPost)

  const activityEnabled = profile.activity && profile.sectionEnabled

  return (
    <div className="grid min-h-0 grid-cols-1 gap-2 sm:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader className="flex-row items-center gap-2 space-y-0 pb-0">
          <User
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <CardTitle className="flex-1">Profile scoring</CardTitle>
          <Switch
            checked={profile.sectionEnabled}
            onCheckedChange={(v) => setProfile({ sectionEnabled: v })}
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-[0.65rem] text-muted-foreground">
                Threshold
              </Label>
              <span className="text-[0.65rem] tabular-nums text-foreground">
                {profile.threshold}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[profile.threshold]}
              onValueChange={([v]) => setProfile({ threshold: v })}
              disabled={!profile.sectionEnabled}
            />
          </div>
          <div className="flex flex-col gap-0.5 border-t border-border pt-1">
            <ToggleRow
              icon={Zap}
              label="Autoscore"
              checked={profile.autoscore}
              onCheckedChange={(v) => setProfile({ autoscore: v })}
              disabled={!profile.sectionEnabled}
            />
            <ToggleRow
              icon={TextCursorInput}
              label="Headline"
              checked={profile.headline}
              onCheckedChange={(v) => setProfile({ headline: v })}
              disabled={!profile.sectionEnabled}
            />
            <ToggleRow
              icon={FileText}
              label="About"
              checked={profile.about}
              onCheckedChange={(v) => setProfile({ about: v })}
              disabled={!profile.sectionEnabled}
            />
            <ToggleRow
              icon={BarChart2}
              label="Activity"
              checked={profile.activity}
              onCheckedChange={(v) => setProfile({ activity: v })}
              disabled={!profile.sectionEnabled}
            />
          </div>
          <div
            className={cn(
              "flex flex-wrap gap-3 border-t border-border pt-2",
              !activityEnabled && "pointer-events-none opacity-50"
            )}
          >
            {(
              [
                ["activityPublished", "Published"],
                ["activityReacted", "Reacted"],
                ["activityCommented", "Commented"],
              ] as const
            ).map(([key, text]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-1.5"
              >
                <Checkbox
                  checked={profile[key]}
                  onCheckedChange={(v) =>
                    setProfile({ [key]: v === true } as Record<string, boolean>)
                  }
                  disabled={!activityEnabled}
                />
                <span className="text-[0.65rem] text-foreground">{text}</span>
              </label>
            ))}
          </div>
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-2 py-1.5">
            <div className="flex gap-1.5">
              <AlertTriangle
                className="mt-0.5 size-3.5 shrink-0 text-destructive"
                aria-hidden
              />
              <p className="text-[0.6rem] leading-snug text-destructive">
                Heavy use of activity scoring can lead to LinkedIn account
                restrictions.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-1">
            <ToggleRow
              icon={Moon}
              label="Use cache"
              checked={profile.useCache}
              onCheckedChange={(v) => setProfile({ useCache: v })}
              disabled={!profile.sectionEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader className="flex-row items-center gap-2 space-y-0 pb-0">
          <FileText
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <CardTitle className="flex-1">Post scoring</CardTitle>
          <Switch
            checked={post.sectionEnabled}
            onCheckedChange={(v) => setPost({ sectionEnabled: v })}
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-[0.65rem] text-muted-foreground">
                Threshold
              </Label>
              <span className="text-[0.65rem] tabular-nums text-foreground">
                {post.threshold}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[post.threshold]}
              onValueChange={([v]) => setPost({ threshold: v })}
              disabled={!post.sectionEnabled}
            />
          </div>
          <div className="flex flex-col gap-0.5 border-t border-border pt-1">
            <ToggleRow
              icon={Zap}
              label="Autoscore"
              checked={post.autoscore}
              onCheckedChange={(v) => setPost({ autoscore: v })}
              disabled={!post.sectionEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
