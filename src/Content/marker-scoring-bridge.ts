import {
  MARKER_KIND_ATTRIBUTE,
  setMarkerInteractionHandler,
  updateMarkerState,
} from "./Marker/Marker.ts"
import { notifyAutoscoreScoreFinished } from "./marker-autoscore.ts"
import { requestMarkerScore } from "./score-request.ts"
import type { MarkerInteractionPayload, MarkerKind } from "./types.ts"

const MARKER_SCORE_RESULT_TYPE = "markerScoreResult" as const
const MARKER_SCORE_ERROR_TYPE = "markerScoreError" as const

function isMarkerScoreResultMessage(
  msg: unknown
): msg is {
  type: typeof MARKER_SCORE_RESULT_TYPE
  markerId: string
  kind: MarkerKind
  score: number
  threshold: number
} {
  if (!msg || typeof msg !== "object") return false
  const m = msg as Record<string, unknown>
  return (
    m.type === MARKER_SCORE_RESULT_TYPE &&
    typeof m.markerId === "string" &&
    (m.kind === "profile" || m.kind === "post") &&
    typeof m.score === "number" &&
    typeof m.threshold === "number"
  )
}

function isMarkerScoreErrorMessage(
  msg: unknown
): msg is {
  type: typeof MARKER_SCORE_ERROR_TYPE
  markerId?: string
  error: string
} {
  if (!msg || typeof msg !== "object") return false
  const m = msg as Record<string, unknown>
  return (
    m.type === MARKER_SCORE_ERROR_TYPE &&
    typeof m.error === "string" &&
    (m.markerId === undefined || typeof m.markerId === "string")
  )
}

function readMarkerKindFromDom(markerId: string): MarkerKind | null {
  const el = document.getElementById(markerId)
  if (!el) return null
  const k = el.getAttribute(MARKER_KIND_ATTRIBUTE)
  if (k === "profile" || k === "post") return k
  return null
}

export function registerMarkerScoringBridge(): void {
  chrome.runtime.onMessage.addListener((message) => {
    if (isMarkerScoreResultMessage(message)) {
      updateMarkerState(message.markerId, {
        state: "score",
        score: message.score,
        threshold: message.threshold,
      })
      notifyAutoscoreScoreFinished(message.markerId, message.kind)
      return
    }
    if (isMarkerScoreErrorMessage(message)) {
      if (message.markerId) {
        updateMarkerState(message.markerId, { state: "default" })
        const kind = readMarkerKindFromDom(message.markerId)
        if (kind) {
          notifyAutoscoreScoreFinished(message.markerId, kind)
        }
      }
      return
    }
  })

  setMarkerInteractionHandler((payload: MarkerInteractionPayload) => {
    requestMarkerScore(payload)
  })
}
