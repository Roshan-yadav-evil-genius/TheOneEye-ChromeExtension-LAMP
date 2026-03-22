import { PopupLayout } from "@/components/layout/popup-layout"
import { MainPanel } from "@/components/main-panel"

export function App() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <PopupLayout>
        <MainPanel />
      </PopupLayout>
    </div>
  )
}

export default App
