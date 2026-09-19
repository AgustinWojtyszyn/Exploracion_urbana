import { shiftClock } from '../systems/shiftClock'
import { CctvPanel } from '../cctv/CctvPanel'
import { useEffect } from 'react'
import { useSessionStore } from '../systems/sessionStore'
import { useBuildingStore } from '../systems/buildingStore'

export function ExplorationHud() {
  const session = useSessionStore()
  const zone = useBuildingStore(s => s.currentZone)
  const cctvOpen = useBuildingStore(s => s.cctvOpen)
  const stage = useBuildingStore(s => s.stage)
  const seconds = useBuildingStore(s => Math.floor(s.shiftSeconds))
  const incident = useBuildingStore(s => s.activeIncident)

  useEffect(() => {
    const mute = (e: KeyboardEvent) => { if (e.repeat) return; if (e.code === 'KeyM') useSessionStore.setState(s => ({ muted: !s.muted })); if (e.code === 'KeyQ') useSessionStore.setState(s => ({ enhanced: !s.enhanced })) }
    window.addEventListener('keydown', mute)
    return () => window.removeEventListener('keydown', mute)
  }, [])
  useEffect(() => {
    if (!session.notice) return
    const timer = window.setTimeout(() => useSessionStore.setState({ notice: '' }), 5200)
    return () => clearTimeout(timer)
  }, [session.notice])

  return <>
    <div className="lens" />
    <CctvPanel />
    <section className="hud">
      <div className="hud__top">
        <div>
          <p className="eyebrow">CONSORCIO TORRE 17 · TURNO NOCHE</p>
          <p className="location">{zone.toUpperCase()}</p>
        </div>
        <div className="clock">{shiftClock(seconds).slice(0, 5)}</div>
      </div>

      {session.locked && !cctvOpen && <>
        <div className="crosshair" />
        <div className="interaction">{session.prompt && <><kbd>E</kbd>{session.prompt}</>}</div>
      </>}

      <p className="notice" role="status">{session.notice}</p>

      {stage === 'end' && <div className="end-caption"><span>17 B</span><p>En el plano no hay nadie ahí.</p><small>FIN DEL PRIMER TURNO</small></div>}
      <footer>
        <span>WASD caminar · mouse mirar · E interactuar · Esc pausar · M {session.muted ? 'activar audio' : 'silenciar'} · Q calidad {session.enhanced ? 'alta' : 'estándar'}</span>
        <span>{incident ? `RECLAMO ACTIVO · ${incident}` : 'SIN RECLAMOS PENDIENTES'}</span>
      </footer>
    </section>

    <div className={`entry ${session.locked || cctvOpen ? 'entry--hidden' : ''}`}>
      <div className="entry__card">
        <p className="eyebrow">Provincia de Buenos Aires · 02:17</p>
        <h1>TORRE<br/><em>17</em></h1>
        <p>Turno noche. Dieciséis pisos, dos ascensores y cuarenta y ocho departamentos.</p>
        <p className="entry__warning">Hay tres novedades pendientes. El encargado del turno anterior dejó el libro sobre el mostrador.</p>
        <button id="enter-tower" disabled={!session.ready}>
          {!session.ready ? 'Encendiendo la portería…' : session.started ? 'Volver al turno' : 'Empezar turno'}
          <span>↗</span>
        </button>
        <small>Teclado y mouse · auriculares recomendados · M silenciar · Q calidad gráfica</small>
      </div>
    </div>
  </>
}
