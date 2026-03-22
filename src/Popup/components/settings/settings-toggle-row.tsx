import type { LucideIcon } from "lucide-react"

import { DisabledHint } from "@/components/settings/disabled-hint"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type SettingsToggleRowProps = {
  icon: LucideIcon
  label: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
  disabled?: boolean
  disabledHint?: string
}

export function SettingsToggleRow({
  icon: Icon,
  label,
  checked,
  onCheckedChange,
  disabled,
  disabledHint,
}: SettingsToggleRowProps) {
  const isDisabled = !!disabled

  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1",
        isDisabled && "opacity-50"
      )}
    >
      <Icon
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
      <span className="min-w-0 flex-1 text-[0.65rem] text-foreground">
        {label}
      </span>
      <DisabledHint
        disabled={isDisabled}
        hint={disabledHint}
        wrapperClassName="shrink-0"
      >
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={isDisabled}
        />
      </DisabledHint>
    </div>
  )
}
