import { updateMarkerState } from "./Marker/Marker.ts"
import type { MarkerInteractionPayload } from "./types.ts"

export const SCORE_MARKER_MESSAGE_TYPE = "scoreMarker" as const

export function requestMarkerScore(
  payload: MarkerInteractionPayload,
  options?: { onSendFailed?: () => void }
): void {
  updateMarkerState(payload.id, { state: "loading" })
  try {
    chrome.runtime.sendMessage(
      {
        type: SCORE_MARKER_MESSAGE_TYPE,
        markerId: payload.id,
        kind: payload.kind,
        data: payload.data,
      },
      () => {
        if (chrome.runtime.lastError) {
          updateMarkerState(payload.id, { state: "default" })
          options?.onSendFailed?.()
        }
      }
    )
  } catch {
    updateMarkerState(payload.id, { state: "default" })
    options?.onSendFailed?.()
  }
}
