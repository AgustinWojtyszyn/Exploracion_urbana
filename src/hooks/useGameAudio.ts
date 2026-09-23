import { useCallback, useEffect, useRef } from 'react'
export function useGameAudio(enabled:boolean) {
  const context=useRef<AudioContext|null>(null)
  useEffect(()=>()=>{void context.current?.close();context.current=null},[])
  return useCallback((good=true)=>{
    if(!enabled)return
    try {
      const audio=context.current??(context.current=new AudioContext())
      void audio.resume().catch(()=>{})
      const oscillator=audio.createOscillator(), gain=audio.createGain()
      oscillator.connect(gain);gain.connect(audio.destination)
      oscillator.frequency.setValueAtTime(good?660:180,audio.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(good?990:90,audio.currentTime+.12)
      gain.gain.setValueAtTime(.055,audio.currentTime)
      gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.16)
      oscillator.start();oscillator.stop(audio.currentTime+.18)
      oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()}
    } catch { /* Audio is optional on devices that do not support it. */ }
  },[enabled])
}
