import {
  mergePostScoring,
  mergeProfileScoring,
} from "../../shared/scoring-settings-defaults.ts"
import type {
  PostScoringSettings,
  ProfileScoringSettings,
} from "@/types/extension-settings"
import {
  parseQualified,
  parseThresholdHits,
} from "@/lib/dashboard-lists-storage"
import {
  LAMP_MIGRATION_VERSION,
  type LampMigrationPayload,
} from "../../shared/lamp-migration.ts"

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === "string")
}

function strictThresholdHits(raw: unknown) {
  if (!Array.isArray(raw)) return null
  const parsed = parseThresholdHits(raw)
  return parsed.length === raw.length ? parsed : null
}

function strictQualified(raw: unknown) {
  if (!Array.isArray(raw)) return null
  const parsed = parseQualified(raw)
  return parsed.length === raw.length ? parsed : null
}

export type ParseMigrationResult =
  | { ok: true; payload: LampMigrationPayload }
  | { ok: false; error: string }

/**
 * Parses and validates migration JSON. Returns a payload safe to apply after merging settings defaults.
 */
export function parseLampMigrationFile(text: string): ParseMigrationResult {
  let data: unknown
  try {
    data = JSON.parse(text) as unknown
  } catch {
    return { ok: false, error: "File is not valid JSON." }
  }

  if (!data || typeof data !== "object") {
    return { ok: false, error: "Migration file must be a JSON object." }
  }

  const o = data as Record<string, unknown>
  if (o.version !== LAMP_MIGRATION_VERSION) {
    return {
      ok: false,
      error: `Unsupported migration version (expected ${LAMP_MIGRATION_VERSION}).`,
    }
  }

  if (typeof o.exportedAt !== "string") {
    return { ok: false, error: "Missing or invalid exportedAt." }
  }

  const int = o.intention
  if (!int || typeof int !== "object") {
    return { ok: false, error: "Missing or invalid intention." }
  }
  const ir = int as Record<string, unknown>
  if (typeof ir.profileDescription !== "string") {
    return { ok: false, error: "Invalid intention.profileDescription." }
  }
  if (typeof ir.postDescription !== "string") {
    return { ok: false, error: "Invalid intention.postDescription." }
  }
  if (!isStringArray(ir.keywords)) {
    return { ok: false, error: "Invalid intention.keywords." }
  }
  if (!isStringArray(ir.headlineTags)) {
    return { ok: false, error: "Invalid intention.headlineTags." }
  }

  const settings = o.settings
  if (!settings || typeof settings !== "object") {
    return { ok: false, error: "Missing or invalid settings." }
  }
  const sr = settings as Record<string, unknown>
  const profilePartial =
    sr.profile && typeof sr.profile === "object" && !Array.isArray(sr.profile)
      ? (sr.profile as Record<string, unknown>)
      : null
  const postPartial =
    sr.post && typeof sr.post === "object" && !Array.isArray(sr.post)
      ? (sr.post as Record<string, unknown>)
      : null
  if (!profilePartial || !postPartial) {
    return { ok: false, error: "Invalid settings.profile or settings.post." }
  }

  const dashboard = o.dashboard
  if (!dashboard || typeof dashboard !== "object") {
    return { ok: false, error: "Missing or invalid dashboard." }
  }
  const dr = dashboard as Record<string, unknown>
  const thresholdHits = strictThresholdHits(dr.thresholdHits)
  const qualified = strictQualified(dr.qualified)
  if (thresholdHits === null) {
    return { ok: false, error: "Invalid dashboard.thresholdHits array." }
  }
  if (qualified === null) {
    return { ok: false, error: "Invalid dashboard.qualified array." }
  }

  const payload: LampMigrationPayload = {
    version: LAMP_MIGRATION_VERSION,
    exportedAt: o.exportedAt,
    intention: {
      profileDescription: ir.profileDescription,
      postDescription: ir.postDescription,
      keywords: ir.keywords,
      headlineTags: ir.headlineTags,
    },
    settings: {
      profile: mergeProfileScoring(profilePartial as Partial<ProfileScoringSettings>),
      post: mergePostScoring(postPartial as Partial<PostScoringSettings>),
    },
    dashboard: {
      thresholdHits,
      qualified,
    },
  }

  return { ok: true, payload }
}
