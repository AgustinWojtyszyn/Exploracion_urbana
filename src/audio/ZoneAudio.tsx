import { useEffect } from 'react'
import { useExplorationStore } from '../systems/explorationStore'
import { useSessionStore } from '../systems/sessionStore'

// Procedural placeholders. Profiles can later reference recordings without changing zone logic.
const profiles: Record<string, { hum: number; wind: number; water: number; frequency: number }> = {
  'linea-cero-anden': { hum: 0.015, wind: 0.03, water: 0, frequency: 100 },
  'galeria-san-jorge': { hum: 0.035, wind: 0.008, water: 0, frequency: 75 },
  mantenimiento: { hum: 0.05, wind: 0.01, water: 0.006, frequency: 62 },
  'sector-tecnico': { hum: 0.065, wind: 0.005, water: 0.003, frequency: 50 },
  'nodo-14': { hum: 0.045, wind: 0.02, water: 0.03, frequency: 38 },
}
export function ZoneAudio() {
  useEffect(() => {
    let context: AudioContext | undefined
    let disposeAudio: (() => void) | undefined
    const start = () => {
      if (!document.pointerLockElement || context) return
      const ctx = new AudioContext(); context = ctx
      const master = ctx.createGain(); master.connect(ctx.destination)
      const hum = ctx.createOscillator(), humGain = ctx.createGain()
      hum.type = 'triangle'; hum.connect(humGain).connect(master); hum.start()
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      let last = 0
      for (let i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * 0.025) / 1.025; data[i] = last * 4 }
      const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true
      const wind = ctx.createBiquadFilter(); wind.type = 'lowpass'; wind.frequency.value = 380
      const windGain = ctx.createGain(); noise.connect(wind).connect(windGain).connect(master)
      const water = ctx.createBiquadFilter(); water.type = 'bandpass'; water.frequency.value = 1800; water.Q.value = 2
      const waterGain = ctx.createGain(); noise.connect(water).connect(waterGain).connect(master); noise.start()
      // Slow railway vibration: a passing load, not a constant musical bed.
      const train = ctx.createOscillator(), trainGain = ctx.createGain(), lfo = ctx.createOscillator(), depth = ctx.createGain()
      train.frequency.value = 29; trainGain.gain.value = 0.018; lfo.frequency.value = 0.025; depth.gain.value = 0.017
      lfo.connect(depth).connect(trainGain.gain); train.connect(trainGain).connect(master); train.start(); lfo.start()
      const update = () => {
        const p = profiles[useExplorationStore.getState().currentZoneId]
        const s = useSessionStore.getState(), t = ctx.currentTime
        master.gain.setTargetAtTime(s.locked && !s.muted ? 0.7 : 0, t, 0.3)
        hum.frequency.setTargetAtTime(p.frequency, t, 1)
        humGain.gain.setTargetAtTime(p.hum, t, 0.8); windGain.gain.setTargetAtTime(p.wind, t, 0.8); waterGain.gain.setTargetAtTime(p.water, t, 0.8)
        if (s.locked && ctx.state === 'suspended') void ctx.resume()
      }
      const unsubZone = useExplorationStore.subscribe(update), unsubSession = useSessionStore.subscribe(update)
      update(); void ctx.resume()
      disposeAudio = () => { unsubZone(); unsubSession(); hum.stop(); noise.stop(); train.stop(); lfo.stop(); void ctx.close() }
    }
    document.addEventListener('pointerlockchange', start)
    return () => { document.removeEventListener('pointerlockchange', start); disposeAudio?.() }
  }, [])
  return null
}
