import type { ReactNode } from "react"

import { PopupSidebar } from "@/components/layout/popup-sidebar"
import { PopupTopNav } from "@/components/layout/popup-top-nav"
import { usePopupNavStore } from "@/stores/popup-nav-store"
import { cn } from "@/lib/utils"

interface PopupLayoutProps {
  children: ReactNode
}

export function PopupLayout({ children }: PopupLayoutProps) {
  const primary = usePopupNavStore((s) => s.primary)
  const showSidebar = primary === "dashboard" || primary === "intention"

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background">
      <PopupTopNav />
      <div className="flex min-h-0 flex-1">
        {showSidebar ? <PopupSidebar /> : null}
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain p-2.5",
            !showSidebar && "pl-2.5"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
