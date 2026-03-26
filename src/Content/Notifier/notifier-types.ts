/** Visual variant for in-page toasts. */
export type NotifierType = "info" | "error" | "success" | "warning"

/** All notifier variants (for iteration / validation). */
export const NOTIFIER_TYPES = [
  "info",
  "error",
  "success",
  "warning",
] as const satisfies readonly NotifierType[]
