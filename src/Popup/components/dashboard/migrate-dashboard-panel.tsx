import { useCallback, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  applyLampMigrationImport,
  exportLampMigrationToBlob,
} from "@/lib/lamp-migration-io"

function migrationFilename(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `lamp-migration-${y}-${m}-${day}.json`
}

/** Export/import intentions, settings, and dashboard lists (Migrate dashboard tab). */
export function MigrateDashboardPanel() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [importIntention, setImportIntention] = useState(true)
  const [importSettings, setImportSettings] = useState(true)
  const [importDashboard, setImportDashboard] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{
    kind: "success" | "error"
    text: string
  } | null>(null)

  const onExport = useCallback(async () => {
    setMessage(null)
    setBusy(true)
    try {
      const blob = await exportLampMigrationToBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = migrationFilename()
      a.click()
      URL.revokeObjectURL(url)
      setMessage({ kind: "success", text: "Export downloaded." })
    } catch {
      setMessage({ kind: "error", text: "Export failed." })
    } finally {
      setBusy(false)
    }
  }, [])

  const onPickFile = useCallback(() => {
    setMessage(null)
    fileRef.current?.click()
  }, [])

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ""
      if (!file) return

      setMessage(null)
      setBusy(true)
      try {
        const text = await file.text()
        const result = await applyLampMigrationImport(text, {
          intention: importIntention,
          settings: importSettings,
          dashboard: importDashboard,
        })
        if (result.ok) {
          setMessage({ kind: "success", text: "Import completed." })
        } else {
          setMessage({ kind: "error", text: result.error })
        }
      } catch {
        setMessage({ kind: "error", text: "Could not read the file." })
      } finally {
        setBusy(false)
      }
    },
    [importIntention, importSettings, importDashboard]
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <p className="shrink-0 text-[0.65rem] leading-snug text-muted-foreground">
        Download a backup of your intentions, scoring settings, and dashboard
        lists. Import merges dashboard rows by profile URL (skips duplicates);
        intentions and settings replace the current values when selected.
      </p>

      <div className="flex shrink-0 flex-col gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={busy}
          onClick={() => void onExport()}
        >
          Export all
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-hidden
          onChange={(e) => void onFileChange(e)}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={busy}
          onClick={onPickFile}
        >
          Import…
        </Button>
      </div>

      <div className="shrink-0 space-y-2 rounded-lg border border-border p-2">
        <p className="text-[0.65rem] font-medium text-foreground">
          Include when importing
        </p>
        <div className="flex items-start gap-2">
          <Checkbox
            id="migrate-import-intention"
            checked={importIntention}
            onCheckedChange={(v) => setImportIntention(v === true)}
            disabled={busy}
          />
          <Label
            htmlFor="migrate-import-intention"
            className="cursor-pointer text-[0.65rem] font-normal leading-snug text-muted-foreground"
          >
            Replace intentions (profile/post text, keywords, headline cues)
          </Label>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="migrate-import-settings"
            checked={importSettings}
            onCheckedChange={(v) => setImportSettings(v === true)}
            disabled={busy}
          />
          <Label
            htmlFor="migrate-import-settings"
            className="cursor-pointer text-[0.65rem] font-normal leading-snug text-muted-foreground"
          >
            Replace scoring settings
          </Label>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="migrate-import-dashboard"
            checked={importDashboard}
            onCheckedChange={(v) => setImportDashboard(v === true)}
            disabled={busy}
          />
          <Label
            htmlFor="migrate-import-dashboard"
            className="cursor-pointer text-[0.65rem] font-normal leading-snug text-muted-foreground"
          >
            Append dashboard lists (dedupe by profile URL)
          </Label>
        </div>
      </div>

      {message ? (
        <p
          className={
            message.kind === "success"
              ? "shrink-0 text-[0.65rem] text-foreground"
              : "shrink-0 text-[0.65rem] text-destructive"
          }
          role={message.kind === "error" ? "alert" : "status"}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  )
}
