/** Cumulative scoring counters persisted for the popup stats panel. */
export type StatsLifetimeBlob = {
  profilesScored: number
  postsScored: number
  relevantProfiles: number
  relevantPosts: number
}

/** Zeroed stats blob used on install and as a merge baseline. */
export const STATS_LIFETIME_DEFAULT: StatsLifetimeBlob = {
  profilesScored: 0,
  postsScored: 0,
  relevantProfiles: 0,
  relevantPosts: 0,
}
