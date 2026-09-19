import { create } from 'zustand'

type SessionState = {
  locked: boolean
  journalOpen: boolean
  ready: boolean
  started: boolean
  muted: boolean
  prompt: string
  notice: string
  setLocked: (locked: boolean) => void
  setReady: () => void
  toggleJournal: () => void
  notify: (notice: string) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  locked: false, journalOpen: false, ready: false, started: false, muted: false,
  prompt: '', notice: '',
  setLocked: (locked) => set((s) => ({ locked, started: s.started || locked, prompt: '' })),
  setReady: () => set({ ready: true }),
  toggleJournal: () => {
    if (document.pointerLockElement) document.exitPointerLock()
    set((s) => ({ journalOpen: !s.journalOpen, prompt: '' }))
  },
  notify: (notice) => set({ notice }),
}))
