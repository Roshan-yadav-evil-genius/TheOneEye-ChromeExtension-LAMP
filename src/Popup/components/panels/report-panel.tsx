import { CircleAlert } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitReportIssue } from "@/lib/submit-report"

export function ReportPanel() {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <CircleAlert
          className="size-3.5 text-muted-foreground"
          aria-hidden
        />
        <Label className="text-xs font-medium">Issue</Label>
      </div>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue..."
        className="min-h-[9rem] resize-none text-[0.65rem]"
        spellCheck
      />
      <p className="text-[0.65rem] leading-snug text-muted-foreground">
        Describe what went wrong or what you&apos;d like to report.
      </p>
      <Button
        type="button"
        className="mt-auto w-full"
        size="sm"
        disabled={isSubmitting || description.trim().length === 0}
        onClick={async () => {
          const trimmedDescription = description.trim()
          if (!trimmedDescription || isSubmitting) {
            return
          }

          setIsSubmitting(true)
          try {
            const message = await submitReportIssue({
              description: trimmedDescription,
            })
            console.info("[Lamp] report submit success", { message })
            setDescription("")
          } catch (error) {
            console.error("[Lamp] report submit failed", error)
          } finally {
            setIsSubmitting(false)
          }
        }}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  )
}
