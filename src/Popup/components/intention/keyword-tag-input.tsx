import { IntentionTagInput } from "@/components/intention/intention-tag-input"
import { useIntentionStore } from "@/stores/intention-store"

/** Intention keywords editor backed by intention-store. */
export function KeywordTagInput() {
  const keywords = useIntentionStore((s) => s.keywords)
  const addKeyword = useIntentionStore((s) => s.addKeyword)
  const removeKeyword = useIntentionStore((s) => s.removeKeyword)

  return (
    <IntentionTagInput
      title="Keywords"
      placeholder="Type a keyword and press Enter or comma"
      tags={keywords}
      onAdd={addKeyword}
      onRemove={removeKeyword}
    />
  )
}
