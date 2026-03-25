/**
 * Marker sync pipeline: registry of page parsers plus collect/apply helpers.
 */
export type { ParserRegistryEntry } from "./Parsers/parser-registry.ts"
export { REGISTERED_PARSERS } from "./Parsers/parser-registry.ts"
export {
  applyMarkerInstructions,
  collectParsedMarkerInstructions,
  runParseAndSyncMarkers,
} from "./parse-and-sync-markers.ts"
