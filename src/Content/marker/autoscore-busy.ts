import type { MarkerKind } from "../types.ts"

let busyProfileMarkerId: string | null = null
let busyPostMarkerId: string | null = null

/** Clears the busy marker id for a kind when the given marker finishes scoring. */
export function clearAutoscoreBusyIfMatches(
  markerId: string,
  kind: MarkerKind
): void {
  if (kind === "profile" && busyProfileMarkerId === markerId) {
    busyProfileMarkerId = null
  }
  if (kind === "post" && busyPostMarkerId === markerId) {
    busyPostMarkerId = null
  }
}

/** Marks which marker id is currently being auto-scored for a kind (exclusive). */
export function setAutoscoreBusyMarkerId(
  kind: MarkerKind,
  markerId: string
): void {
  if (kind === "profile") {
    busyProfileMarkerId = markerId
  } else {
    busyPostMarkerId = markerId
  }
}

/** Returns the marker id currently busy for autoscore for the given kind, if any. */
export function getAutoscoreBusyMarkerId(kind: MarkerKind): string | null {
  return kind === "profile" ? busyProfileMarkerId : busyPostMarkerId
}
