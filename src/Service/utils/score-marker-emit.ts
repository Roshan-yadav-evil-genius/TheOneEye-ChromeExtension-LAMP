import {
  MARKER_SCORE_ERROR_TYPE,
  MARKER_SCORE_RESULT_TYPE,
  type TabMarkerScorePayload,
} from "../types/score-marker-messages.ts"

/**
 * Sends a successful score payload to the content script in the given tab.
 *
 * @remarks Uses chrome.tabs.sendMessage; logs emit for debugging.
 */
export async function emitMarkerScoreResult(
  tabId: number,
  payload: TabMarkerScorePayload
): Promise<void> {
  console.log("[SCORE][EMIT] sending score result", { tabId, payload })
  await chrome.tabs.sendMessage(tabId, {
    type: MARKER_SCORE_RESULT_TYPE,
    markerId: payload.markerId,
    kind: payload.kind,
    data: payload.data,
    score: payload.score,
    threshold: payload.threshold,
  })
}

/**
 * Notifies the content script that scoring failed for a marker.
 *
 * @remarks Swallows send failures (e.g. tab closed); logs errors.
 */
export async function emitMarkerScoreError(
  tabId: number,
  markerId: string | undefined,
  error: string
): Promise<void> {
  try {
    console.error("[SCORE][EMIT][ERROR] sending score error", {
      tabId,
      markerId,
      error,
    })
    await chrome.tabs.sendMessage(tabId, {
      type: MARKER_SCORE_ERROR_TYPE,
      markerId,
      error,
    })
  } catch (sendError) {
    console.error("[SCORE][EMIT][ERROR] failed to send score error", {
      tabId,
      markerId,
      error,
      sendError,
    })
    // Tab may have navigated away
  }
}
