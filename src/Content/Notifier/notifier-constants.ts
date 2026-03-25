/** document.getElementById target for the toast stack host. */
export const NOTIFICATION_CONTAINER_ELEMENT_ID =
  "TheOneEyeNotificationContainer" as const

/** Base CSS class applied to each toast element. */
export const NOTIFICATION_TOAST_CLASS = "TheOneEyeNotifierToast" as const

/** Time each toast stays visible before removal. */
export const NOTIFICATION_DURATION_MS = 2000

/** Stacked toasts sit below this offset from the top. */
export const NOTIFICATION_TOP_OFFSET_PX = 16

/** Horizontal inset from the right viewport edge for the toast stack. */
export const NOTIFICATION_RIGHT_OFFSET_PX = 16

/** Stacking order so toasts sit above LinkedIn page UI. */
export const NOTIFICATION_Z_INDEX = 2147483646
