import type { ProfileScoringSettings } from "../../Popup/types/extension-settings.ts"
import type { VoyagerActivityKey } from "./types.ts"

/** One GraphQL activity feed query keyed for enrichment payload assembly. */
export type ActivityRequestType = {
  key: VoyagerActivityKey
  queryId: string
  refererSuffix: "all" | "reactions" | "comments"
}

/** Catalog of Voyager activity queries used when profile activity toggles are on. */
export const ACTIVITY_REQUEST_TYPES: ActivityRequestType[] = [
  {
    key: "published",
    queryId: "voyagerFeedDashProfileUpdates.4af00b28d60ed0f1488018948daad822",
    refererSuffix: "all",
  },
  {
    key: "reacted",
    queryId: "voyagerFeedDashProfileUpdates.3a42619bc23360ce8c29e737277e2ea9",
    refererSuffix: "reactions",
  },
  {
    key: "commented",
    queryId: "voyagerFeedDashProfileUpdates.8f05a4e5ad12d9cb2b56eaa22afbcab9",
    refererSuffix: "comments",
  },
]

/** Filters ACTIVITY_REQUEST_TYPES by the user’s published/reacted/commented toggles. */
export function getEnabledActivityRequestTypes(
  settings: ProfileScoringSettings
): ActivityRequestType[] {
  if (!settings.activity) return []

  return ACTIVITY_REQUEST_TYPES.filter((requestType) => {
    if (requestType.key === "published") return settings.activityPublished
    if (requestType.key === "reacted") return settings.activityReacted
    return settings.activityCommented
  })
}
