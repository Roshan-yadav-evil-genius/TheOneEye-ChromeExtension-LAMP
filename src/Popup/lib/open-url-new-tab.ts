/**
 * Opens a URL in a new browser tab (extension popup context).
 * Relies on host_permissions for the target origin.
 */
export function openUrlInNewTab(raw: string): void {
  if (typeof chrome === "undefined" || !chrome.tabs?.create) return
  const trimmed = raw.trim()
  if (!trimmed) return
  let url: string
  if (/^https?:\/\//i.test(trimmed)) {
    url = trimmed
  } else if (trimmed.startsWith("/")) {
    url = `https://www.linkedin.com${trimmed}`
  } else {
    url = `https://${trimmed}`
  }
  void chrome.tabs.create({ url, active: false })
}
