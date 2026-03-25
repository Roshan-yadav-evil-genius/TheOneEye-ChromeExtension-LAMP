import { create } from "zustand"

import { normalizeIntentionTag } from "@/lib/normalize-intention-tag"

/** Popup intention text and tags (persisted via initPopupStorage). */
interface IntentionState {
  profileDescription: string
  postDescription: string
  keywords: string[]
  headlineTags: string[]
  setProfileDescription: (value: string) => void
  setPostDescription: (value: string) => void
  addKeyword: (raw: string) => void
  removeKeyword: (keyword: string) => void
  addHeadlineTag: (raw: string) => void
  removeHeadlineTag: (tag: string) => void
}

/** Zustand store for profile/post descriptions and keyword/headline tag lists. */
export const useIntentionStore = create<IntentionState>((set, get) => ({
  profileDescription: "",
  postDescription: "",
  keywords: [],
  headlineTags: [],
  setProfileDescription: (value) => set({ profileDescription: value }),
  setPostDescription: (value) => set({ postDescription: value }),
  addKeyword: (raw) => {
    const next = normalizeIntentionTag(raw)
    if (!next) return
    const { keywords } = get()
    if (keywords.includes(next)) return
    set({ keywords: [...keywords, next] })
  },
  removeKeyword: (keyword) =>
    set({ keywords: get().keywords.filter((k) => k !== keyword) }),
  addHeadlineTag: (raw) => {
    const next = normalizeIntentionTag(raw)
    if (!next) return
    const { headlineTags } = get()
    if (headlineTags.includes(next)) return
    set({ headlineTags: [...headlineTags, next] })
  },
  removeHeadlineTag: (tag) =>
    set({ headlineTags: get().headlineTags.filter((t) => t !== tag) }),
}))
