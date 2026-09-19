import { useEffect } from 'react'
import { useBuildingStore } from '../systems/buildingStore'
import { useSessionStore } from '../systems/sessionStore'
import { listenerPose, soundLayers, subscribeSound } from './soundscape'

export function ZoneAudio() {
  useEffect(() => {
    let ctx: AudioContext | undefined
    let dispose: (() => void) | undefined
    const start = () => {
      if (!document.pointerLockElement || ctx) return
      const context = new AudioContext(); ctx = context
      const master = context.createGain(); master.gain.value = 0; master.connect(context.destination)
      const panner = (position: number[]) => {
        const p = context.createPanner(); p.panningModel = 'HRTF'; p.distanceModel = 'inverse'; p.refDistance = 2; p.rolloffFactor = .8
        p.positionX.value = position[0]; p.positionY.value = position[1]; p.positionZ.value = position[2]; p.connect(master); return p
      }
      const loops = soundLayers.map(layer => {
        const source = context.createOscillator(), gain = context.createGain(), pan = panner(layer.position)
        source.type = layer.voice; source.frequency.value = layer.frequency; gain.gain.value = layer.gain
        source.connect(gain).connect(pan); source.start(); return { source, gain, pan, id: layer.id }
      })
      const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate)
      const data = buffer.getChannelData(0); let last = 0
      for (let i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * .018) / 1.025; data[i] = last * 3 }
      const street = context.createBufferSource(); street.buffer = buffer; street.loop = true
      const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 420
      const streetGain = context.createGain(); streetGain.gain.value = .07
      const streetPan = panner([0, 1.5, 11]); street.connect(filter).connect(streetGain).connect(streetPan); street.start()
      const live = new Set<OscillatorNode>()
      const tone = (frequency: number, duration: number, volume: number, position: number[], delay = 0, type: OscillatorType = 'sine') => {
        const source = context.createOscillator(), gain = context.createGain(), pan = panner(position), t = context.currentTime + delay
        source.type = type; source.frequency.setValueAtTime(frequency, t)
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(volume, t + .015); gain.gain.exponentialRampToValueAtTime(.0001, t + duration)
        source.connect(gain).connect(pan); source.start(t); source.stop(t + duration + .02); live.add(source)
        source.onended = () => { live.delete(source); source.disconnect(); gain.disconnect(); pan.disconnect() }
      }
      const unsubscribeCues = subscribeSound(cue => {
        if (!useSessionStore.getState().locked || useSessionStore.getState().muted) return
        if (cue === 'door') { tone(135, .35, .025, [0, 1, 10], 0, 'triangle'); tone(240, .08, .017, [0, 1, 10], .3) }
        else tone(86, .11, .018, [listenerPose.position[0], 0, listenerPose.position[2]])
      })
      let lastStage = useBuildingStore.getState().stage, cadence = 0, lastMix = ''
      const update = () => {
        const state = useBuildingStore.getState(), session = useSessionStore.getState(), t = context.currentTime
        const mix = `${session.locked}:${session.muted}:${state.elevator}`
        if (mix !== lastMix) {
          master.gain.setTargetAtTime(session.locked && !session.muted ? .65 : 0, t, .12)
          const motor = loops.find(l => l.id === 'shaft')!
          motor.gain.gain.setTargetAtTime(state.elevator === 'moving' || state.elevator === 'opening' ? .07 : .013, t, .5)
          lastMix = mix
        }
        if (state.stage === lastStage) return
        lastStage = state.stage
        if (state.stage === 'testing') tone(180, .09, .05, [2, 1.4, -8.8], 0, 'square')
        if (state.stage === 'normal') { tone(830, 1.5, .055, [.8, 2.6, -8.8]); tone(1108, 1.3, .018, [.8, 2.6, -8.8], .12) }
        if (state.stage === 'anomaly') { tone(76, 3, .07, [.8, 0, -10]); tone(390, .2, .028, [.8, 3, -10], 2) }
        if (state.stage === 'answered') { tone(190, .15, .02, [-5.3, 1.6, -8.4]); tone(970, .4, .008, [-5.3, 1.6, -8.4], .4, 'triangle') }
        if (state.stage === 'opening') { tone(180, .09, .05, [.8, 2, -9], 0, 'square'); tone(640, 2, .033, [.8, 2.5, -9], .25) }
      }
      const interval = window.setInterval(() => {
        if (!ctx) return
        const listener = context.listener, t = context.currentTime, { position: p, forward: f } = listenerPose
        listener.positionX.setTargetAtTime(p[0], t, .05); listener.positionY.setTargetAtTime(p[1], t, .05); listener.positionZ.setTargetAtTime(p[2], t, .05)
        listener.forwardX.setTargetAtTime(f[0], t, .05); listener.forwardY.setTargetAtTime(f[1], t, .05); listener.forwardZ.setTargetAtTime(f[2], t, .05)
        listener.upX.value = 0; listener.upY.value = 1; listener.upZ.value = 0
        if (!useSessionStore.getState().locked || useSessionStore.getState().muted) return
        cadence++
        // Traffic swells slowly; plumbing/door transients never act as jump scares.
        streetGain.gain.setTargetAtTime(.04 + (1 + Math.sin(cadence / 47)) * .024, t, 1)
        if (useBuildingStore.getState().stage === 'ringing' && cadence % 25 === 0) {
          tone(440, .38, .06, [-5.3, 1.6, -8.4], 0, 'triangle'); tone(480, .38, .05, [-5.3, 1.6, -8.4], .45, 'triangle')
        }
        if (cadence % 190 === 0) tone(125, .6, .018, [4.6, 2, -10], 0, 'triangle')
        if (cadence % 310 === 0) { tone(210, .13, .007, [2, 1, 14], 0, 'triangle'); tone(180, .17, .006, [2, 1, 14], .25, 'triangle') }
      }, 100)
      const a = useBuildingStore.subscribe(update), b = useSessionStore.subscribe(update)
      update(); void context.resume()
      dispose = () => { a(); b(); unsubscribeCues(); clearInterval(interval); loops.forEach(l => { l.source.stop(); l.source.disconnect(); l.gain.disconnect(); l.pan.disconnect() }); street.stop(); live.forEach(s => s.stop()); void context.close() }
    }
    document.addEventListener('pointerlockchange', start)
    return () => { document.removeEventListener('pointerlockchange', start); dispose?.() }
  }, [])
  return null
}
