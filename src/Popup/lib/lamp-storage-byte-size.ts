import { LAMP_STORAGE_KEYS } from "../../shared/lamp-storage-key-list.ts"

export async function getLampStorageBytesInUse(): Promise<number> {
  if (typeof chrome === "undefined" || !chrome.storage?.local?.getBytesInUse) {
    return 0
  }
  return chrome.storage.local.getBytesInUse([...LAMP_STORAGE_KEYS])
}

export function lampStorageKeysTouched(changes: Record<string, unknown>): boolean {
  return LAMP_STORAGE_KEYS.some((k) => k in changes)
}
