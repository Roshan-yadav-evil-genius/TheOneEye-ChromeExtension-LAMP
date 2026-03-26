import { ensureNotificationContainer } from "../Notifier/index.ts"
import { tickAutoscoreAfterScan } from "../marker/autoscore.ts"
import { runParseAndSyncMarkers } from "../Parser/index.ts"
import { getScoringSectionEnabledFromChrome } from "../../shared/get-scoring-settings-from-chrome.ts"

let pageScanTimerId: ReturnType<typeof setInterval> | null = null

/** One scan: ensures notifier host, syncs markers to current section flags, then ticks autoscore. */
function runScanCycle(): void {
  ensureNotificationContainer()
  void getScoringSectionEnabledFromChrome().then((section) => {
    runParseAndSyncMarkers(section)
    tickAutoscoreAfterScan()
  })
}

/**
 * Starts a periodic LinkedIn page scan for marker placement and autoscore.
 *
 * @remarks Clears any prior interval; first cycle runs immediately.
 */
export function startLinkedInPageScan(intervalMs = 1000): ReturnType<
  typeof setInterval
> {
  stopLinkedInPageScan()
  runScanCycle()
  pageScanTimerId = setInterval(runScanCycle, intervalMs)
  return pageScanTimerId
}

/** Stops the periodic page scan interval if running. */
export function stopLinkedInPageScan(): void {
  if (pageScanTimerId != null) {
    clearInterval(pageScanTimerId)
    pageScanTimerId = null
  }
}
