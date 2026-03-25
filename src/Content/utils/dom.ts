/** Evaluates an XPath as an ordered snapshot under ctx (default document). */
export function xpathOrderedSnapshot(
  expr: string,
  ctx: Node = document
): XPathResult {
  return document.evaluate(
    expr,
    ctx,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )
}

/** Returns the first node matching expr under ctx, or null. */
export function xpathFirstNode(expr: string, ctx: Node): Node | null {
  return document.evaluate(
    expr,
    ctx,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}

/** Collects non-empty img.src values from an XPath snapshot of image nodes. */
export function collectImgSrcsFromSnapshot(snapshot: XPathResult): string[] {
  const out: string[] = []
  for (let j = 0; j < snapshot.snapshotLength; j++) {
    const img = snapshot.snapshotItem(j)
    if (img instanceof HTMLImageElement && img.src) {
      out.push(img.src)
    }
  }
  return out
}
