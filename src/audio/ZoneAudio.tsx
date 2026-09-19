import { useEffect } from 'react'
import { useBuildingStore } from '../systems/buildingStore'
import { useSessionStore } from '../systems/sessionStore'

const profiles: Record<string, { hum: number; air: number; freq: number }> = {
  lobby: { hum: 0.018, air: 0.012, freq: 87 },
  porteria: { hum: 0.015, air: 0.007, freq: 71 },
  servicios: { hum: 0.035, air: 0.01, freq: 56 },
  ascensores: { hum: 0.05, air: 0.004, freq: 42 },
}

export function ZoneAudio() {
  useEffect(() => {
    let ctx: AudioContext | undefined
    let dispose: (() => void) | undefined
    const start = () => {
      if (!document.pointerLockElement || ctx) return
      ctx = new AudioContext()
      const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination)
      const hum = ctx.createOscillator(); hum.type = 'triangle'
      const humGain = ctx.createGain(); hum.connect(humGain).connect(master); hum.start()

      const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      let last = 0
      for (let i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * .02) / 1.02; data[i] = last * 3 }
      const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 380
      const air = ctx.createGain(); noise.connect(filter).connect(air).connect(master); noise.start()

      const elevator = ctx.createOscillator(); elevator.type = 'sine'; elevator.frequency.value = 29
      const elevatorGain = ctx.createGain(); elevatorGain.gain.value = .009
      elevator.connect(elevatorGain).connect(master); elevator.start()

      const update = () => {
        if (!ctx) return
        const p = profiles[useBuildingStore.getState().currentZone] ?? profiles.lobby
        const session = useSessionStore.getState()
        const t = ctx.currentTime
        master.gain.setTargetAtTime(session.locked && !session.muted ? .72 : 0, t, .25)
        hum.frequency.setTargetAtTime(p.freq, t, .8)
        humGain.gain.setTargetAtTime(p.hum, t, .5)
        air.gain.setTargetAtTime(p.air, t, .5)
        elevatorGain.gain.setTargetAtTime(useBuildingStore.getState().currentZone === 'ascensores' ? .028 : .006, t, 1)
      }
      const a = useBuildingStore.subscribe(update)
      const b = useSessionStore.subscribe(update)
      update(); void ctx.resume()
      dispose = () => { a(); b(); hum.stop(); noise.stop(); elevator.stop(); void ctx?.close() }
    }
    document.addEventListener('pointerlockchange', start)
    return () => { document.removeEventListener('pointerlockchange', start); dispose?.() }
  }, [])
  return null
}
