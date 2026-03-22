const UNITS = ["B", "KB", "MB", "GB"] as const

/** Compact human-readable size for UI (base 1024). */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B"
  if (bytes === 0) return "0 B"
  let n = bytes
  let u = 0
  while (n >= 1024 && u < UNITS.length - 1) {
    n /= 1024
    u += 1
  }
  const digits = u === 0 ? 0 : n >= 100 ? 0 : n >= 10 ? 1 : 2
  return `${n.toFixed(digits)} ${UNITS[u]}`
}
