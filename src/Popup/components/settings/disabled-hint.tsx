import type { ReactNode } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type DisabledHintProps = {
  disabled: boolean
  hint?: string
  children: ReactNode
  /** Applied to the hover/focus target when the hint is shown */
  wrapperClassName?: string
}

/**
 * When `disabled` and `hint` are set, wraps children so tooltips work (disabled controls
 * do not receive pointer events in the browser).
 */
export function DisabledHint({
  disabled,
  hint,
  children,
  wrapperClassName,
}: DisabledHintProps) {
  const text = hint?.trim()
  if (!disabled || !text) {
    return children
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-default items-center outline-none",
            wrapperClassName
          )}
          tabIndex={0}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className="max-w-[15rem] text-left leading-snug"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  )
}
