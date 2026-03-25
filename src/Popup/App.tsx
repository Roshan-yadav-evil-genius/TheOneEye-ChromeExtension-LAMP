import { useEffect } from "react"

import { PopupLayout } from "@/components/layout/popup-layout"
import { MainPanel } from "@/components/main-panel"
import { initPopupStorage } from "@/lib/popup-storage-sync"

/** Root popup view: wires chrome storage sync and renders the shell + main panel. */
export function App() {
  useEffect(() => initPopupStorage(), [])

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PopupLayout>
        <MainPanel />
      </PopupLayout>
    </div>
  )
}

export default App
