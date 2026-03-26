/**
 * Extension service worker (Manifest V3). Event-driven; avoid assuming a long-lived process.
 */
import { writeExtensionInstallDefaultsToChrome } from "../shared/extension-install-storage.ts"
import { registerScoreMarkerListener } from "./scoreMarkerHandler.ts"

registerScoreMarkerListener()

/** Seeds chrome.storage.local on first extension install. */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install") return
  void writeExtensionInstallDefaultsToChrome()
})
