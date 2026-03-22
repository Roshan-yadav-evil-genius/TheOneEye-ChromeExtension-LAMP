import {
  readIntentionFromChrome,
  readScoringSettingsFromChrome,
  writeIntentionToChrome,
  writeScoringSettingsToChrome,
} from "@/lib/chrome-popup-storage"
import {
  getLampStorageBytesInUse,
  lampStorageKeysTouched,
} from "@/lib/lamp-storage-byte-size"
import { readStatsLifetimeFromChrome } from "@/lib/stats-lifetime-storage"
import { clampScoringToIntention } from "@/lib/clamp-scoring-to-intention"
import { useIntentionStore } from "@/stores/intention-store"
import {
  mergePostScoring,
  mergeProfileScoring,
  useScoringSettingsStore,
} from "@/stores/scoring-settings-store"
import { useStatsStore } from "@/stores/stats-store"

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

async function refreshStatsFromChrome(): Promise<void> {
  const [blob, bytes] = await Promise.all([
    readStatsLifetimeFromChrome(),
    getLampStorageBytesInUse(),
  ])
  useStatsStore.getState().hydrateLifetime(blob)
  useStatsStore.getState().setStorageBytesUsed(bytes)
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

    await refreshStatsFromChrome()
    if (cancelled) return

    disposers.push(
      useIntentionStore.subscribe(persistIntentionNow),
      useScoringSettingsStore.subscribe(persistScoringNow)
    )
  })()

  const onStorageChanged: Parameters<
    typeof chrome.storage.onChanged.addListener
  >[0] = (changes, area) => {
    if (area !== "local") return
    if (!lampStorageKeysTouched(changes)) return
    void refreshStatsFromChrome()
  }
  if (typeof chrome !== "undefined" && chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener(onStorageChanged)
    disposers.push(() => {
      chrome.storage.onChanged.removeListener(onStorageChanged)
    })
  }

  return () => {
    cancelled = true
    disposers.splice(0).forEach((dispose) => dispose())
  }
}
