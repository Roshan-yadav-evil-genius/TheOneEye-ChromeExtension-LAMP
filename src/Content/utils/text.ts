/** Text content of leaf text nodes under descendants that directly hold visible text. */
export function extractDirectTextList(node: ParentNode): string[] {
  return Array.from(node.querySelectorAll("*"))
    .filter((el) =>
      Array.from(el.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue?.trim()
      )
    )
    .map((el) =>
      Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => (n.nodeValue ?? "").trim())
        .join(" ")
    )
}
