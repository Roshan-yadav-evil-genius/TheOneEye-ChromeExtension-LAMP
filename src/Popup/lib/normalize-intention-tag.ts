export function normalizeIntentionTag(raw: string): string {
  return raw.trim().replace(/^,+|,+$/g, "").trim()
}
