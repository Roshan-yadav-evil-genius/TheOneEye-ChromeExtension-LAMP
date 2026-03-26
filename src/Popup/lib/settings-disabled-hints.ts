/** User-facing copy for disabled scoring controls (Intention / Settings). */

/** Explains why the Profile scoring master switch is disabled. */
export function hintProfileSectionSwitch(
  hasProfileIntent: boolean
): string | undefined {
  if (hasProfileIntent) return undefined
  return "Add a profile intention under Intention → Profile, then return here to enable profile scoring."
}

/** Explains why the Post scoring master switch is disabled. */
export function hintPostSectionSwitch(
  hasPostIntent: boolean
): string | undefined {
  if (hasPostIntent) return undefined
  return "Add a post intention under Intention → Post, then return here to enable post scoring."
}

export function hintWhenProfileScoringInactive(
  hasProfileIntent: boolean,
  profileSectionEnabled: boolean
): string | undefined {
  if (hasProfileIntent && profileSectionEnabled) return undefined
  if (!hasProfileIntent) {
    return "Add a profile intention under Intention → Profile first."
  }
  return "Turn on Profile scoring above to use these options."
}

/** Explains disabled post sub-options when intention or section is off. */
export function hintWhenPostScoringInactive(
  hasPostIntent: boolean,
  postSectionEnabled: boolean
): string | undefined {
  if (hasPostIntent && postSectionEnabled) return undefined
  if (!hasPostIntent) {
    return "Add a post intention under Intention → Post first."
  }
  return "Turn on Post scoring above to use these options."
}

/** Explains why Activity toggles are blocked (About + intentions + section gates). */
export function hintWhenActivitySectionBlocked(
  hasProfileIntent: boolean,
  profileSectionEnabled: boolean,
  profileAbout: boolean,
  hasPostIntent: boolean
): string | undefined {
  if (
    hasProfileIntent &&
    profileSectionEnabled &&
    profileAbout &&
    hasPostIntent
  ) {
    return undefined
  }
  if (!hasProfileIntent) {
    return "Add a profile intention under Intention → Profile first."
  }
  if (!profileSectionEnabled) {
    return "Turn on Profile scoring above to use Activity."
  }
  if (!profileAbout) {
    return "Enable About above first; Activity uses profile context together with your post intention."
  }
  if (!hasPostIntent) {
    return "Add a post intention under Intention → Post to enable Activity scoring."
  }
  return undefined
}

/** When profile scoring is on but headline tags are empty. */
export const HINT_HEADLINE_TAGS_REQUIRED =
  "Add at least one headline target under Intention → Headline to enable Headline scoring."

/** Hint for Published/Reacted/Commented when parent Activity or gates are off. */
export function hintActivitySubOptions(
  activityEnabled: boolean,
  hasProfileIntent: boolean,
  profileSectionEnabled: boolean,
  profileAbout: boolean,
  hasPostIntent: boolean,
  profileActivity: boolean
): string | undefined {
  if (activityEnabled) return undefined
  if (!profileActivity) {
    return "Turn on Activity above to choose Published, Reacted, or Commented."
  }
  return hintWhenActivitySectionBlocked(
    hasProfileIntent,
    profileSectionEnabled,
    profileAbout,
    hasPostIntent
  )
}
