import { useCallback } from 'react'
export function useHaptic(enabled:boolean){
  return useCallback((good:boolean)=>{
    if(!enabled||typeof navigator.vibrate!=='function')return
    try { navigator.vibrate(good?15:[12,35,12]) } catch { /* Optional device feedback. */ }
  },[enabled])
}
