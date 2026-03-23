/** Thrown when the extension was reloaded/removed while a content script is still on the page. */
export function isExtensionContextInvalidatedError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e)
  return msg.includes("Extension context invalidated")
}
