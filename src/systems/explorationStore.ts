import { create } from 'zustand'
import { evidence, requiredEvidence } from '../data/discoveries'

export type DiscoveryKind =
  | 'access'
  | 'signal'
  | 'graffiti'
  | 'infrastructure'
  | 'anomaly'
  | 'story'

export type Discovery = {
  id: string
  title: string
  kind: DiscoveryKind
  zoneId: string
  note?: string
  discoveredAt: number
}

type ExplorationState = {
  observedMarkIds: string[]
  connection: boolean
  accessOpen: boolean
  reachedBelow: boolean
  knownZoneIds: string[]
  observeMark: (id: string) => void
  connectEvidence: (ids: string[], circuit: string, destination: string) => boolean
  openAccess: () => boolean
  reachBelow: () => void
  currentZoneId: string
  discoveries: Discovery[]
  mappedZoneIds: string[]
  setCurrentZone: (zoneId: string) => void
  recordDiscovery: (discovery: Omit<Discovery, 'discoveredAt'>) => void
  markZoneMapped: (zoneId: string) => void
}

export const useExplorationStore = create<ExplorationState>((set) => ({
  observedMarkIds: [], connection: false, accessOpen: false, reachedBelow: false,
  knownZoneIds: ['linea-cero-anden'],
  observeMark: (id) => {
    if (!['platform', 'gallery'].includes(id)) return
    set((s) => {
      const marks = [...new Set([...s.observedMarkIds, id])]
      return { observedMarkIds: marks,
        discoveries: marks.length === 2 && !s.discoveries.some(d => d.id === 'numbers')
          ? [...s.discoveries, { ...evidence.numbers, discoveredAt: Date.now() }] : s.discoveries }
    })
  },
  connectEvidence: (ids, circuit, destination) => {
    let valid = false
    set((s) => {
      valid = requiredEvidence.every(id => ids.includes(id) && s.discoveries.some(d => d.id === id))
        && circuit.trim() === '14' && destination === 'below'
      return valid ? { connection: true } : s
    })
    return valid
  },
  openAccess: () => {
    let opened = false
    set((s) => { opened = s.connection; return opened ? { accessOpen: true } : s })
    return opened
  },
  reachBelow: () => set({ reachedBelow: true }),
  currentZoneId: 'linea-cero-anden',
  discoveries: [],
  mappedZoneIds: [],
  setCurrentZone: (zoneId) => set((s) => ({ currentZoneId: zoneId,
    knownZoneIds: s.knownZoneIds.includes(zoneId) ? s.knownZoneIds : [...s.knownZoneIds, zoneId] })),
  recordDiscovery: (discovery) =>
    set((state) => {
      if (state.discoveries.some((item) => item.id === discovery.id)) return state
      return {
        discoveries: [
          ...state.discoveries,
          { ...discovery, discoveredAt: Date.now() },
        ],
      }
    }),
  markZoneMapped: (zoneId) =>
    set((state) => ({
      mappedZoneIds: state.mappedZoneIds.includes(zoneId)
        ? state.mappedZoneIds
        : [...state.mappedZoneIds, zoneId],
    })),
}))
