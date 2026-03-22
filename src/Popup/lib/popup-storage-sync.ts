import {
  readIntentionFromChrome,
  readScoringSettingsFromChrome,
  writeIntentionToChrome,
  writeScoringSettingsToChrome,
} from "@/lib/chrome-popup-storage"
import { clampScoringToIntention } from "@/lib/clamp-scoring-to-intention"
import { useIntentionStore } from "@/stores/intention-store"
import {
  mergePostScoring,
  mergeProfileScoring,
  useScoringSettingsStore,
} from "@/stores/scoring-settings-store"

function persistIntentionNow(): void {
  const { profileDescription, postDescription, keywords } =
    useIntentionStore.getState()
  void writeIntentionToChrome({
    profileDescription,
    postDescription,
    keywords,
  })
}

function persistScoringNow(): void {
  const { profile, post } = useScoringSettingsStore.getState()
  void writeScoringSettingsToChrome({ profile, post })
}

/**
 * Loads persisted popup slices, applies business rules, then persists on every store change.
 */
export function initPopupStorage(): () => void {
  let cancelled = false
  const disposers: Array<() => void> = []

  void (async () => {
    const [intentionPartial, scoringPartial] = await Promise.all([
      readIntentionFromChrome(),
      readScoringSettingsFromChrome(),
    ])
    if (cancelled) return

    useIntentionStore.setState((s) => ({ ...s, ...intentionPartial }))
    useScoringSettingsStore.setState({
      profile: mergeProfileScoring(scoringPartial.profile),
      post: mergePostScoring(scoringPartial.post),
    })
    clampScoringToIntention()
    if (cancelled) return

    disposers.push(
      useIntentionStore.subscribe(persistIntentionNow),
      useScoringSettingsStore.subscribe(persistScoringNow)
    )
  })()

  return () => {
    cancelled = true
    disposers.splice(0).forEach((dispose) => dispose())
  }
}
