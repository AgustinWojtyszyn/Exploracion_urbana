import { useEffect, useRef, useState } from 'react'
import { zones } from '../data/zones'
import { useExplorationStore } from '../systems/explorationStore'
import { useSessionStore } from '../systems/sessionStore'

const mapPositions: Record<string, [number, number]> = {
  'linea-cero-anden': [230, 70], 'galeria-san-jorge': [420, 150], mantenimiento: [230, 240], 'sector-tecnico': [65, 320], 'nodo-14': [65, 435],
}
export function FieldJournal() {
  const state = useExplorationStore()
  const close = useSessionStore(s => s.toggleJournal)
  const [selected, setSelected] = useState<string[]>([])
  const [circuit, setCircuit] = useState('')
  const [destination, setDestination] = useState('')
  const [feedback, setFeedback] = useState('')
  const [note, setNote] = useState(() => sessionStorage.getItem('city-below-note') ?? '')
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { dialog.current?.showModal(); return () => dialog.current?.close() }, [])
  return <dialog ref={dialog} className="journal" onCancel={e => { e.preventDefault(); close() }} aria-labelledby="journal-title">
    <header className="journal__header"><div><p className="eyebrow">Arroyo / relevamiento nocturno</p><h1 id="journal-title">Lo que no figura</h1></div><button onClick={close} autoFocus>Cerrar · M</button></header>
    <div className="journal__columns">
      <section><h2>01 / Croquis de campo</h2><p className="muted">Sin escala. Solo lo recorrido; las líneas discontinuas son hipótesis.</p>
        <svg viewBox="0 0 560 490" role="img" aria-label="Croquis de zonas conocidas y conexión al nivel inferior">
          <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" opacity=".09" /></pattern></defs>
          <rect width="560" height="490" fill="url(#grid)" />
          {state.knownZoneIds.includes('galeria-san-jorge') && <path d="M230 70H420V150" className="map-line" />}
          {state.knownZoneIds.includes('mantenimiento') && <path d="M230 70V240" className="map-line" />}
          {state.knownZoneIds.includes('sector-tecnico') && <path d="M230 240V320H65" className="map-line" />}
          {state.connection && <path d="M65 320V435" className="map-line" strokeDasharray={state.accessOpen ? undefined : '5 6'} />}
          {zones.filter(z => state.knownZoneIds.includes(z.id) || (z.id === 'nodo-14' && state.connection)).map(z => {
            const [x, y] = mapPositions[z.id]
            return <g key={z.id}><circle cx={x} cy={y} r="5" fill="currentColor" /><text x={x + 12} y={y - 10}>{z.name}</text><text x={x + 12} y={y + 12} className="map-note">{state.mappedZoneIds.includes(z.id) ? 'trazado registrado' : 'relevamiento incompleto'}</text></g>
          })}
        </svg>
        <button onClick={() => state.markZoneMapped(state.currentZoneId)}>Anotar el trazado de este sector</button>
        {state.connection && <p className="handwritten">14 no es un número de local. El plano y el circuito hablan del mismo nivel. Puedo aislar esa derivación en el enclavamiento.</p>}
        <label className="note-label">Anotaciones personales<textarea value={note} placeholder="Un ruido, un desvío, algo que no cierra…" onChange={e => { setNote(e.target.value); sessionStorage.setItem('city-below-note', e.target.value) }} /></label>
      </section>
      <section><h2>02 / Documentos y señales</h2>
        {state.discoveries.length === 0 && <p>Todavía no copié ningún documento. El andén conserva un plano ferroviario.</p>}
        {state.observedMarkIds.length === 1 && <p className="handwritten">Anotación suelta: 14, subrayado. Visto en {state.observedMarkIds[0] === 'platform' ? 'un pilar del andén' : 'el fondo de la galería'}.</p>}
        {state.discoveries.map(d => <label className="evidence" key={d.id}>
          <input type="checkbox" checked={selected.includes(d.id)} onChange={() => setSelected(s => s.includes(d.id) ? s.filter(id => id !== d.id) : [...s, d.id])} />
          <span><strong>{d.title}</strong><span>{d.note}</span></span>
        </label>)}
        {!state.connection && <form className="deduction" onSubmit={e => {
          e.preventDefault()
          setFeedback(state.connectEvidence(selected, circuit, destination) ? 'La referencia coincide. Anoté el recorrido probable.' : 'Esta lectura todavía no se sostiene. Revisá los documentos seleccionados, la referencia y el destino.')
        }}>
          <h2>03 / Relacionar documentos</h2><p>Seleccioná los registros que sostienen tu lectura.</p>
          <div className="deduction__fields"><label>Circuito<input aria-label="Circuito" inputMode="numeric" maxLength={3} value={circuit} onChange={e => setCircuit(e.target.value)} placeholder="—" /></label>
          <label>Alimenta<select aria-label="Alimenta" value={destination} onChange={e => setDestination(e.target.value)}><option value="">Elegir destino…</option><option value="gallery">Los locales de la galería</option><option value="below">Un nivel bajo el andén</option><option value="office">La boletería cerrada</option></select></label></div>
          <button type="submit">Trazar conexión</button>
        </form>}
        <p role="status">{feedback}</p>
      </section>
    </div>
  </dialog>
}
