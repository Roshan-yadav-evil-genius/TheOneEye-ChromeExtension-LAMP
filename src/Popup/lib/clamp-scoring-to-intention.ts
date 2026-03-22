import { useIntentionStore } from "@/stores/intention-store"
import { useScoringSettingsStore } from "@/stores/scoring-settings-store"

/**
 * Ensures scoring toggles stay consistent with intention text and profile Activity gates
 * (About on + non-empty post intention).
 */
export function clampScoringToIntention(): void {
  const { profileDescription, postDescription } = useIntentionStore.getState()
  const hasProfileIntent = profileDescription.trim().length > 0
  const hasPostIntent = postDescription.trim().length > 0

  const scoring = useScoringSettingsStore.getState()
  if (!hasProfileIntent && scoring.profile.sectionEnabled) {
    scoring.setProfile({ sectionEnabled: false })
  }
  if (!hasPostIntent && scoring.post.sectionEnabled) {
    scoring.setPost({ sectionEnabled: false })
  }

  const { profile, setProfile } = useScoringSettingsStore.getState()
  const activityAllowed = profile.about && hasPostIntent
  if (
    !activityAllowed &&
    (profile.activity ||
      profile.activityPublished ||
      profile.activityReacted ||
      profile.activityCommented)
  ) {
    setProfile({
      activity: false,
      activityPublished: false,
      activityReacted: false,
      activityCommented: false,
    })
  }
}
