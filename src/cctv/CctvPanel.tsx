import { shiftClock } from '../systems/shiftClock'
import { useEffect } from 'react'
import { useBuildingStore } from '../systems/buildingStore'
import { feedLabels } from './CctvMonitor'
export function CctvPanel() {
  const open = useBuildingStore(s => s.cctvOpen)
  const anomaly = useBuildingStore(s => s.anomaly17Visible)
  const seconds = useBuildingStore(s => Math.floor(s.shiftSeconds))
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.code === 'Escape' || e.code === 'KeyE') useBuildingStore.getState().closeCameras() }
    if (open) window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  if (!open) return null
  return <div className="cctv-panel">
    <header>VIGÍA · Videovigilancia local <span>DVR-04 / REC ●</span></header>
    <div className="cctv-picture"><canvas id="cctv-feed" width={640} height={360} />
      <div className="cctv-labels">{feedLabels.map((label, i) => <div key={label}><span>CÁMARA {i === 3 && anomaly ? '08 — PISO ?' : label}</span><small>19/09 · {shiftClock(seconds)}{i === 3 && !anomaly ? ' / VIDEO LOSS' : ' / REC'}</small></div>)}</div>
    </div>
    <footer>H.264 · 4 canales · {anomaly ? 'Canal 08: origen no registrado' : 'Canal 08: desconectado'} <button onClick={() => useBuildingStore.getState().closeCameras()}>Volver [E]</button></footer>
  </div>
}
