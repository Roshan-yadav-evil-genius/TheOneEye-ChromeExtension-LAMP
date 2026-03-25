import type { ParsedMarkerInstruction } from "../../types.ts"
import {
  matchesFeedPostsLocation,
  parseFeedPosts,
} from "./feed-posts.parser.ts"
import {
  matchesMyNetworkLocation,
  parseMyNetworkProfiles,
} from "./mynetwork-profiles.parser.ts"
import {
  matchesFeedRecommendedLocation,
  parseRecommendedProfiles,
} from "./recommended-profiles.parser.ts"
import {
  matchesSearchProfilesLocation,
  parseSearchProfiles,
} from "./search-profiles.parser.ts"

export type ParserRegistryEntry = {
  id: string
  matchesLocation: (loc: Location) => boolean
  parse: () => ParsedMarkerInstruction[]
}

export const REGISTERED_PARSERS: readonly ParserRegistryEntry[] = [
  {
    id: "mynetwork-profiles",
    matchesLocation: matchesMyNetworkLocation,
    parse: parseMyNetworkProfiles,
  },
  {
    id: "feed-recommended-profiles",
    matchesLocation: matchesFeedRecommendedLocation,
    parse: parseRecommendedProfiles,
  },
  {
    id: "search-profiles",
    matchesLocation: matchesSearchProfilesLocation,
    parse: parseSearchProfiles,
  },
  {
    id: "feed-posts",
    matchesLocation: matchesFeedPostsLocation,
    parse: parseFeedPosts,
  },
]
