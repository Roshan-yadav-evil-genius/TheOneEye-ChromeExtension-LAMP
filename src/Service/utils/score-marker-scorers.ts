import type { Post, Profile } from "../../Content/types.ts"
import type { ScoringIntentionSnapshot } from "../../shared/get-intention-from-chrome.ts"
import type { ScoringSettingsBundle } from "../../shared/get-scoring-settings-from-chrome.ts"

/** Placeholder: replace with real profile scoring. */
export function scoreLinkedInProfile(
  data: Profile,
  intention: ScoringIntentionSnapshot,
  settings: ScoringSettingsBundle
): number {
  const payload ={
    data,
    intention,
  }
  void settings
  console.log("scoreLinkedInProfile", payload)
  return Math.floor(Math.random() * 101)
}

/** Placeholder: replace with real post scoring. */
export function scoreLinkedInPost(
  data: Post,
  intention: ScoringIntentionSnapshot,
  settings: ScoringSettingsBundle
): number {
  const payload ={
    data,
    intention:{objective:intention.postDescription,Keywords:intention.keywords},
  }
  void settings
  
  console.log("scoreLinkedInPost", payload)

  return Math.floor(Math.random() * 101)
}
