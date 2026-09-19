// Replace a layer's procedural voice with a decoded sample at the same panner/gain.
export type SoundLayer = { id: string; position: [number, number, number]; frequency: number; gain: number; voice: OscillatorType }
export const soundLayers: SoundLayer[] = [
  { id: 'fluorescent', position: [0, 3, 1], frequency: 100, gain: .007, voice: 'triangle' },
  { id: 'ventilation', position: [-4, 1.5, 3], frequency: 71, gain: .014, voice: 'sine' },
  { id: 'pump', position: [4.7, 0, -10], frequency: 49, gain: .029, voice: 'triangle' },
  { id: 'shaft', position: [.8, 2, -9], frequency: 32, gain: .013, voice: 'sine' },
]
// Mutable audio pose avoids React/Zustand updates every frame.
export const listenerPose = { position: [0, 1.6, 8.7], forward: [0, 0, -1] }
export type SoundCue = 'door' | 'step'
const listeners = new Set<(cue: SoundCue) => void>()
export function requestSound(cue: SoundCue) { listeners.forEach(listener => listener(cue)) }
export function subscribeSound(listener: (cue: SoundCue) => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
