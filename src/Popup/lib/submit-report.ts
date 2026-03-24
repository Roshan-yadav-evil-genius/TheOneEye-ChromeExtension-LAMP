import type { ReportIssuePayload } from "@/types/extension-settings"

const REPORT_API_BASE = "http://127.0.0.1:7878/api/workflow"
const REPORT_WORKFLOW_ID = "1771881b-6d1e-4b5d-b645-5df14e0374d1"

const REPORT_API_HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Api-Key PjLdurRlGML4dxrTH-hJew0j-rgJ2MwWzDBRczrrlRs",
} as const

const toTheOneEyeServerPayload = (payload: unknown) => ({
  input: payload,
  timeout: 30000,
})

async function getCurrentPageUrl(): Promise<string> {
  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })
    return activeTab?.url ?? ""
  } catch (error) {
    console.warn("[Lamp] failed to read active tab URL", error)
    return ""
  }
}

export async function submitReportIssue(
  payload: ReportIssuePayload
): Promise<string> {
  const currentPageUrl = await getCurrentPageUrl()
  const requestBody = toTheOneEyeServerPayload({
    reported_issue: payload.description,
    current_page_url: currentPageUrl,
    source: "LAMP Chrome Extension",
  })

  const response = await fetch(
    `${REPORT_API_BASE}/${REPORT_WORKFLOW_ID}/execute/`,
    {
      method: "POST",
      headers: REPORT_API_HEADERS,
      body: JSON.stringify(requestBody),
    }
  )

  if (!response.ok) {
    throw new Error(`report_api_http_${response.status}`)
  }

  const responseBody = (await response.json()) as { msg?: unknown }
  if (typeof responseBody.msg !== "string" || responseBody.msg.length === 0) {
    throw new Error("report_api_invalid_response")
  }

  return responseBody.msg
}
