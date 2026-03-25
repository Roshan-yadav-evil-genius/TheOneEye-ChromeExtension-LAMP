import { ensureNotificationContainer } from "../Notifier/index.ts"
import { tickAutoscoreAfterScan } from "../marker/autoscore.ts"
import { runParseAndSyncMarkers } from "../Parser/index.ts"
import { getScoringSectionEnabledFromChrome } from "../../shared/get-scoring-settings-from-chrome.ts"

let pageScanTimerId: ReturnType<typeof setInterval> | null = null

function runScanCycle(): void {
  ensureNotificationContainer()
  void getScoringSectionEnabledFromChrome().then((section) => {
    runParseAndSyncMarkers(section)
    tickAutoscoreAfterScan()
  })
}

export function startLinkedInPageScan(intervalMs = 1000): ReturnType<
  typeof setInterval
> {
  stopLinkedInPageScan()
  runScanCycle()
  pageScanTimerId = setInterval(runScanCycle, intervalMs)
  return pageScanTimerId
}

export function stopLinkedInPageScan(): void {
  if (pageScanTimerId != null) {
    clearInterval(pageScanTimerId)
    pageScanTimerId = null
  }
}
