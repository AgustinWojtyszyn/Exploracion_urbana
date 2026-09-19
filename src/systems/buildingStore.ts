import { create } from 'zustand'

export type BuildingZone = 'lobby' | 'porteria' | 'servicios' | 'ascensores'

type BuildingState = {
  currentZone: BuildingZone
  activeIncident: string
  incidentStage: number
  anomaly17Visible: boolean
  cameraAnomalySeen: boolean
  setZone: (zone: BuildingZone) => void
  inspectElevator: () => void
  inspectCameras: () => void
}

export const useBuildingStore = create<BuildingState>((set) => ({
  currentZone: 'lobby',
  activeIncident: 'Ascensor B detenido entre pisos',
  incidentStage: 0,
  anomaly17Visible: false,
  cameraAnomalySeen: false,
  setZone: (currentZone) => set({ currentZone }),
  inspectElevator: () => set((state) => ({
    incidentStage: Math.max(state.incidentStage, 1),
    anomaly17Visible: true,
    activeIncident: 'Indicador de ascensor fuera de rango',
  })),
  inspectCameras: () => set((state) => ({
    incidentStage: Math.max(state.incidentStage, 2),
    cameraAnomalySeen: true,
    activeIncident: 'Cámara 08: pasillo sin identificar',
  })),
}))
