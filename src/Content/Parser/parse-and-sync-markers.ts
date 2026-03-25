import { placeScoringButton, removeScoringButton } from "../marker/marker.ts"
import type { ParsedMarkerInstruction, ScoringSectionFlags } from "../types.ts"
import { REGISTERED_PARSERS } from "./Parsers/parser-registry.ts"

export function collectParsedMarkerInstructions(
  loc: Location = location
): ParsedMarkerInstruction[] {
  return REGISTERED_PARSERS.flatMap((entry) =>
    entry.matchesLocation(loc) ? entry.parse() : []
  )
}

export function applyMarkerInstructions(
  section: ScoringSectionFlags,
  instructions: ParsedMarkerInstruction[]
): void {
  for (const instr of instructions) {
    if (instr.kind === "profile") {
      if (section.profile) {
        placeScoringButton(instr.anchor, {
          kind: "profile",
          data: instr.data,
          ...(instr.float !== undefined ? { float: instr.float } : {}),
        })
      } else {
        removeScoringButton(instr.anchor, {
          kind: "profile",
          float: instr.float !== false,
        })
      }
    } else {
      if (section.post) {
        placeScoringButton(instr.anchor, {
          kind: "post",
          data: instr.data,
          ...(instr.float !== undefined ? { float: instr.float } : {}),
        })
      } else {
        removeScoringButton(instr.anchor, {
          kind: "post",
          float: instr.float !== false,
        })
      }
    }
  }
}

export function runParseAndSyncMarkers(
  section: ScoringSectionFlags,
  loc: Location = location
): void {
  applyMarkerInstructions(section, collectParsedMarkerInstructions(loc))
}
