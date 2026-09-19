import { useEffect } from 'react'
import { useSessionStore } from '../systems/sessionStore'
import { useBuildingStore } from '../systems/buildingStore'

export function ExplorationHud() {
  const session = useSessionStore()
  const zone = useBuildingStore(s => s.currentZone)
  const incident = useBuildingStore(s => s.activeIncident)

  useEffect(() => {
    if (!session.notice) return
    const timer = window.setTimeout(() => useSessionStore.setState({ notice: '' }), 5200)
    return () => clearTimeout(timer)
  }, [session.notice])

  return <>
    <section className="hud">
      <div className="hud__top">
        <div>
          <p className="eyebrow">CONSORCIO TORRE 17 · TURNO NOCHE</p>
          <p className="location">{zone.toUpperCase()}</p>
        </div>
        <div className="clock">02:17</div>
      </div>

      {session.locked && <>
        <div className="crosshair" />
        <div className="interaction">{session.prompt && <><kbd>E</kbd>{session.prompt}</>}</div>
      </>}

      <p className="notice">{session.notice}</p>

      <footer>
        <span>WASD caminar · mouse mirar · E interactuar · Esc liberar mouse</span>
        <span>{incident ? `RECLAMO ACTIVO · ${incident}` : 'SIN RECLAMOS PENDIENTES'}</span>
      </footer>
    </section>

    <div className={`entry ${session.locked ? 'entry--hidden' : ''}`}>
      <div className="entry__card">
        <p className="eyebrow">Provincia de Buenos Aires · 02:17</p>
        <h1>TORRE<br/><em>17</em></h1>
        <p>Turno noche. Dieciséis pisos, dos ascensores y cuarenta y ocho departamentos.</p>
        <p className="entry__warning">El ascensor de servicio volvió a marcar un piso que no existe.</p>
        <button id="enter-tower" disabled={!session.ready}>
          {!session.ready ? 'Encendiendo la portería…' : session.started ? 'Volver al turno' : 'Empezar turno'}
          <span>↗</span>
        </button>
        <small>Prototipo de atmósfera · teclado y mouse · auriculares recomendados</small>
      </div>
    </div>
  </>
}
