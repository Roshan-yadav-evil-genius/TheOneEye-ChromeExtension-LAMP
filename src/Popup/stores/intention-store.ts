import { create } from "zustand"

interface IntentionState {
  profileDescription: string
  postDescription: string
  keywords: string[]
  setProfileDescription: (value: string) => void
  setPostDescription: (value: string) => void
  addKeyword: (raw: string) => void
  removeKeyword: (keyword: string) => void
}

function normalizeKeyword(raw: string): string {
  return raw.trim().replace(/^,+|,+$/g, "").trim()
}

export const useIntentionStore = create<IntentionState>((set, get) => ({
  profileDescription:
    "we provide managed automation service that designs, operates, and governs business-critical automation workflows for companies.",
  postDescription: "",
  keywords: [
    "automation systems",
    "workflow orchestration",
    "automation infrastructure",
  ],
  setProfileDescription: (value) => set({ profileDescription: value }),
  setPostDescription: (value) => set({ postDescription: value }),
  addKeyword: (raw) => {
    const next = normalizeKeyword(raw)
    if (!next) return
    const { keywords } = get()
    if (keywords.includes(next)) return
    set({ keywords: [...keywords, next] })
  },
  removeKeyword: (keyword) =>
    set({ keywords: get().keywords.filter((k) => k !== keyword) }),
}))
