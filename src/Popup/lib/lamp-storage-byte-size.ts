import { LAMP_STORAGE_KEYS } from "../../shared/lamp-storage-key-list.ts"

/** Returns total bytes used in chrome.storage.local for Lamp-owned keys. */
export async function getLampStorageBytesInUse(): Promise<number> {
  if (typeof chrome === "undefined" || !chrome.storage?.local?.getBytesInUse) {
    return 0
  }
  return chrome.storage.local.getBytesInUse([...LAMP_STORAGE_KEYS])
}

/** True if a storage change event touched any Lamp-managed key. */
export function lampStorageKeysTouched(changes: Record<string, unknown>): boolean {
  return LAMP_STORAGE_KEYS.some((k) => k in changes)
}
