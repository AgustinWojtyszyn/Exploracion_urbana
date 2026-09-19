import { create } from 'zustand'

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
  currentZoneId: string
  discoveries: Discovery[]
  mappedZoneIds: string[]
  setCurrentZone: (zoneId: string) => void
  recordDiscovery: (discovery: Omit<Discovery, 'discoveredAt'>) => void
  markZoneMapped: (zoneId: string) => void
}

export const useExplorationStore = create<ExplorationState>((set) => ({
  currentZoneId: 'linea-cero-anden',
  discoveries: [],
  mappedZoneIds: [],
  setCurrentZone: (zoneId) => set({ currentZoneId: zoneId }),
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
