import { THE_ONE_EYE_MARKER_CLASS } from "./constants.ts"
import {
  getMarkerAutoscoreFlags,
  getMarkerPayloadForId,
  MARKER_KIND_ATTRIBUTE,
  MARKER_STATE_ATTRIBUTE,
  setMarkerAutoscoreFlags,
} from "./Marker/Marker.ts"
import { requestMarkerScore } from "./score-request.ts"
import type { MarkerKind } from "./types.ts"
import { getScoringAutoscoreFlagsFromChrome } from "../shared/get-scoring-autoscore-flags.ts"

/** Must match [scoring-storage-keys.ts](../../shared/scoring-storage-keys.ts). */
const SETTINGS_PROFILE_SCORING = "settings_profile_scoring" as const
const SETTINGS_POST_SCORING = "settings_post_scoring" as const

let busyProfileMarkerId: string | null = null
let busyPostMarkerId: string | null = null

function clearBusyIfMatches(kind: MarkerKind, markerId: string): void {
  if (kind === "profile" && busyProfileMarkerId === markerId) {
    busyProfileMarkerId = null
  }
  if (kind === "post" && busyPostMarkerId === markerId) {
    busyPostMarkerId = null
  }
}

export function notifyAutoscoreScoreFinished(
  markerId: string,
  kind: MarkerKind
): void {
  clearBusyIfMatches(kind, markerId)
  queueMicrotask(() => {
    tryStartAutoscoreForKind(kind)
  })
}

function tryStartAutoscoreForKind(kind: MarkerKind): void {
  const flags = getMarkerAutoscoreFlags()
  if (kind === "profile" && !flags.profile) return
  if (kind === "post" && !flags.post) return
  if (kind === "profile" && busyProfileMarkerId !== null) return
  if (kind === "post" && busyPostMarkerId !== null) return

  const selector = `button.${THE_ONE_EYE_MARKER_CLASS}[${MARKER_KIND_ATTRIBUTE}="${kind}"][${MARKER_STATE_ATTRIBUTE}="default"]`
  const el = document.querySelector(selector)
  if (!(el instanceof HTMLButtonElement) || !el.id) return

  const payload = getMarkerPayloadForId(el.id)
  if (!payload) return

  if (kind === "profile") {
    busyProfileMarkerId = el.id
  } else {
    busyPostMarkerId = el.id
  }

  const markerId = el.id
  requestMarkerScore(payload, {
    onSendFailed: () => {
      clearBusyIfMatches(kind, markerId)
      queueMicrotask(() => {
        tryStartAutoscoreForKind(kind)
      })
    },
  })
}

export function tickAutoscoreAfterScan(): void {
  tryStartAutoscoreForKind("profile")
  tryStartAutoscoreForKind("post")
}

async function refreshAutoscoreFlagsFromStorage(): Promise<void> {
  const f = await getScoringAutoscoreFlagsFromChrome()
  setMarkerAutoscoreFlags({ profile: f.profile, post: f.post })
}

export async function registerMarkerAutoscore(): Promise<void> {
  await refreshAutoscoreFlagsFromStorage()

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return
    if (!changes[SETTINGS_PROFILE_SCORING] && !changes[SETTINGS_POST_SCORING]) {
      return
    }
    void refreshAutoscoreFlagsFromStorage().then(() => {
      tickAutoscoreAfterScan()
    })
  })

  tickAutoscoreAfterScan()
}
