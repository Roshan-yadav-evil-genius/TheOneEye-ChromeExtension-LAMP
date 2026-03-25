/** Trims a keyword/headline tag and strips stray leading/trailing commas. */
export function normalizeIntentionTag(raw: string): string {
  return raw.trim().replace(/^,+|,+$/g, "").trim()
}
