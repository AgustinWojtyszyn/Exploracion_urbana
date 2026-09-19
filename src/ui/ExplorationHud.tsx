import { useEffect } from 'react'
import { zones } from '../data/zones'
import { useExplorationStore } from '../systems/explorationStore'
import { useSessionStore } from '../systems/sessionStore'
import { FieldJournal } from '../journal/FieldJournal'

export function ExplorationHud() {
  const session = useSessionStore()
  const zoneId = useExplorationStore(s => s.currentZoneId)
  const ended = useExplorationStore(s => s.reachedBelow)
  const zone = zones.find(z => z.id === zoneId)
  useEffect(() => {
    if (!session.notice) return
    const timer = window.setTimeout(() => useSessionStore.setState({ notice: '' }), 6500)
    return () => window.clearTimeout(timer)
  }, [session.notice])
  return <>
    <section className="hud" aria-label="Interfaz de exploración">
      <div><p className="eyebrow">The City Below / 23:47</p><p className="location">{zone?.name}</p></div>
      {session.locked && <><div className="crosshair" /><div className="interaction">{session.prompt && <><kbd>E</kbd> {session.prompt}</>}</div></>}
      <p className="notice" role="status">{session.notice}</p>
      <footer><span>WASD caminar · Mouse mirar · E registrar · M cuaderno · Esc pausa</span><span>{ended ? 'FIN DEL RECORRIDO / EL RELEVAMIENTO CONTINÚA' : 'ARCHIVO DE CAMPO / 001'}</span></footer>
    </section>
    {/* Always mounted so PointerLockControls can bind its explicit start target. */}
    <div className={`entry ${session.locked || session.journalOpen ? 'entry--hidden' : ''}`}>
      <div className="entry__card"><p className="eyebrow">Una exploración en Arroyo</p><h1>The City<br /><em>Below</em></h1>
        <p>El último tren ya pasó.<br />Algo sigue funcionando debajo del andén.</p>
        <button id="enter-station" disabled={!session.ready}>{!session.ready ? 'Preparando la estación…' : session.started ? 'Volver al recorrido' : 'Entrar a la estación'} <span>↗</span></button>
        <p className="entry__instructions">Caminá, observá y copiá lo que no encaja.<br />Abrí el cuaderno con M para relacionar tus hallazgos.</p>
        <button className="text-button" onClick={() => useSessionStore.setState({ muted: !session.muted })}>Audio ambiental: {session.muted ? 'apagado' : 'encendido'}</button>
        <small>Teclado y mouse · Auriculares recomendados<br />Progreso de esta sesión; recargar reinicia el recorrido.</small>
      </div>
    </div>
    {session.journalOpen && <FieldJournal />}
  </>
}
