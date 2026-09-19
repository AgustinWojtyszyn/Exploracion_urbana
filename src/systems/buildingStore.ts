import { create } from 'zustand'
import { initialIncidents, type Incident } from '../incidents/incidents'

export type BuildingZone = 'lobby' | 'porteria' | 'servicios' | 'ascensores'
export type Stage = 'arrival' | 'complaint' | 'cameras' | 'testing' | 'normal' | 'anomaly' | 'ringing' | 'answered' | 'opening' | 'end'
export type ElevatorState = 'idle' | 'called' | 'moving' | 'arrived' | 'opening' | 'held'
export const EVENT_TIMING = { testing: 5, normal: 18, anomaly: 7, answered: 4, opening: 9 } as const
const hints: Record<Stage, string> = {
  arrival: 'Leer el libro de novedades en portería', complaint: 'Reclamo 024 · Revisar las cámaras', cameras: 'Probar la llamada del ascensor B',
  testing: 'Ascensor B · Comprobando respuesta', normal: 'Ascensor B · Respuesta normal. Esperar junto al indicador',
  anomaly: 'Verificar el plano de evacuación', ringing: 'Llamada entrante · Atender portero junto al plano',
  answered: 'La llamada sigue conectada', opening: 'El ascensor B está respondiendo', end: 'Fin del primer registro de turno',
}
type BuildingState = {
  currentZone: BuildingZone; stage: Stage; elapsed: number; shiftSeconds: number; activeIncident: string
  incidents: Incident[]; anomaly17Visible: boolean; cameraAnomalySeen: boolean; planRead: boolean
  elevator: ElevatorState; floor: string; cctvOpen: boolean
  setZone: (zone: BuildingZone) => void; readLog: () => void; inspectCameras: () => void
  closeCameras: () => void; inspectElevator: () => void; readPlan: () => void; answerPhone: () => void; tick: (dt: number) => void
}
export const useBuildingStore = create<BuildingState>((set, get) => {
  const advance = (stage: Stage, extra: Partial<BuildingState> = {}) => set({ stage, elapsed: 0, activeIncident: hints[stage], ...extra })
  return {
    currentZone: 'lobby', stage: 'arrival', elapsed: 0, shiftSeconds: 0, activeIncident: hints.arrival,
    incidents: initialIncidents.map(i => ({ ...i })), anomaly17Visible: false, cameraAnomalySeen: false, planRead: false,
    elevator: 'idle', floor: 'PB', cctvOpen: false,
    setZone: currentZone => set({ currentZone }),
    readLog: () => { if (get().stage === 'arrival') advance('complaint', { incidents: get().incidents.map(i => i.id === '024' ? { ...i, status: 'en revisión' } : i) }) },
    inspectCameras: () => {
      set({ cctvOpen: true, cameraAnomalySeen: get().anomaly17Visible || get().cameraAnomalySeen })
      if (get().stage === 'complaint') advance('cameras')
    },
    closeCameras: () => set({ cctvOpen: false }),
    inspectElevator: () => { if (get().stage === 'cameras') advance('testing', { elevator: 'called', floor: '6' }) },
    readPlan: () => set({ planRead: true }),
    answerPhone: () => { if (get().stage === 'ringing') advance('answered') },
    tick: dt => {
      const s = get(), elapsed = s.elapsed + dt
      set({ elapsed, shiftSeconds: s.shiftSeconds + dt })
      if (s.stage === 'testing') {
        const floor = elapsed < 1 ? '6' : elapsed < 2.5 ? '3' : elapsed < 4 ? '1' : 'PB'
        set({ floor, elevator: elapsed < 1 ? 'called' : elapsed < 4 ? 'moving' : 'arrived' })
        if (elapsed >= EVENT_TIMING.testing) advance('normal', { floor: 'PB', elevator: 'idle' })
      }
      if (s.stage === 'normal' && elapsed >= EVENT_TIMING.normal) advance('anomaly', { anomaly17Visible: true, floor: '17' })
      if (s.stage === 'anomaly' && s.planRead && elapsed >= EVENT_TIMING.anomaly) advance('ringing')
      if (s.stage === 'answered' && elapsed >= EVENT_TIMING.answered) advance('opening', { elevator: 'opening' })
      if (s.stage === 'opening' && elapsed >= EVENT_TIMING.opening) advance('end', { elevator: 'held' })
    },
  }
})
