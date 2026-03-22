import { tickAutoscoreAfterScan } from "./marker-autoscore.ts"
import { runAllLinkedInParsers } from "./Parser/index.ts"

let linkedInPageScanTimerId: ReturnType<typeof setInterval> | null = null

function runScanCycle(): void {
  runAllLinkedInParsers()
  tickAutoscoreAfterScan()
}

export function startLinkedInPageScan(intervalMs = 1000): ReturnType<
  typeof setInterval
> {
  stopLinkedInPageScan()
  runScanCycle()
  linkedInPageScanTimerId = setInterval(runScanCycle, intervalMs)
  return linkedInPageScanTimerId
}

export function stopLinkedInPageScan(): void {
  if (linkedInPageScanTimerId != null) {
    clearInterval(linkedInPageScanTimerId)
    linkedInPageScanTimerId = null
  }
}
