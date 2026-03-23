import type { Post, Profile } from "../../Content/types.ts"
import type { ScoringIntentionSnapshot } from "../../shared/get-intention-from-chrome.ts"

/** Placeholder: replace with real profile scoring. */
export function scoreLinkedInProfile(
  _data: Profile,
  _intention: ScoringIntentionSnapshot
): number {
  const payload = {
    data: _data,
    intention: _intention,
  }
  console.log("scoreLinkedInProfile", payload)
  return Math.floor(Math.random() * 101)
}

/** Placeholder: replace with real post scoring. */
export function scoreLinkedInPost(
  _data: Post,
  _intention: ScoringIntentionSnapshot
): number {
  const payload = {
    data: _data,
    intention: _intention,
  }
  console.log("scoreLinkedInPost", payload)
  return Math.floor(Math.random() * 101)
}
