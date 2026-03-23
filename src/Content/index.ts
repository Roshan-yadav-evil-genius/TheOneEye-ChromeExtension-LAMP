/**
 * Runs in page contexts matched by manifest `content_scripts`.
 * Keep this entry self-contained to avoid extra chunk files in the extension package.
 */
import { registerMarkerAutoscore } from "./marker-autoscore.ts"
import { registerMarkerScoringBridge } from "./marker-scoring-bridge.ts"
import { startLinkedInPageScan } from "./scanner.ts"

function init(): void {
  if (!location.hostname.endsWith("linkedin.com")) return
  registerMarkerScoringBridge()
  void registerMarkerAutoscore()
    .then(() => {
      startLinkedInPageScan()
    })
    .catch(() => {})
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true })
} else {
  init()
}
