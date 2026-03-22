export type StatsLifetimeBlob = {
  profilesScored: number
  postsScored: number
  relevantProfiles: number
  relevantPosts: number
}

export const STATS_LIFETIME_DEFAULT: StatsLifetimeBlob = {
  profilesScored: 0,
  postsScored: 0,
  relevantProfiles: 0,
  relevantPosts: 0,
}
