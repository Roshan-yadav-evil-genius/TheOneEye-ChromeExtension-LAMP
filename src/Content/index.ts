/**
 * Runs in page contexts matched by manifest `content_scripts`.
 * Keep this entry self-contained to avoid extra chunk files in the extension package.
 */
import { registerMarkerAutoscore } from "./marker/autoscore.ts"
import { registerMarkerScoringBridge } from "./marker/scoring-bridge.ts"
import { startLinkedInPageScan } from "./scanner/scanner.ts"
import { matchesExtensionHost } from "./utils/url.ts"

/** Registers scoring bridge, autoscore, and LinkedIn scan when the URL matches the extension host. */
function init(): void {
  if (!matchesExtensionHost(location)) return
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
