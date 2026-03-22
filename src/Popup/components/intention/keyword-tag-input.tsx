import { X } from "lucide-react"
import { useCallback, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useIntentionStore } from "@/stores/intention-store"

export function KeywordTagInput() {
  const keywords = useIntentionStore((s) => s.keywords)
  const addKeyword = useIntentionStore((s) => s.addKeyword)
  const removeKeyword = useIntentionStore((s) => s.removeKeyword)
  const [draft, setDraft] = useState("")

  const commitDraft = useCallback(() => {
    addKeyword(draft)
    setDraft("")
  }, [addKeyword, draft])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commitDraft()
      return
    }
    if (e.key === ",") {
      e.preventDefault()
      commitDraft()
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <h2 className="shrink-0 text-xs font-medium text-foreground">Keywords</h2>
      <div className="flex min-h-0 flex-1 flex-wrap content-start gap-1 overflow-y-auto">
        {keywords.map((k) => (
          <Badge
            key={k}
            variant="secondary"
            className="gap-0.5 pr-0.5 pl-1.5 font-normal"
          >
            <button
              type="button"
              className="rounded-sm p-0.5 hover:bg-background/60"
              aria-label={`Remove ${k}`}
              onClick={() => removeKeyword(k)}
            >
              <X className="size-2.5" strokeWidth={2.5} />
            </button>
            <span>{k}</span>
          </Badge>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (draft.trim()) commitDraft()
        }}
        placeholder="Type a keyword and press Enter or comma"
        className="shrink-0 text-[0.65rem]"
      />
    </div>
  )
}
