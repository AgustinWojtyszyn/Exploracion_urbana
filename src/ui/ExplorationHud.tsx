import { zones } from '../data/zones'
import { useExplorationStore } from '../systems/explorationStore'

export function ExplorationHud() {
  const zoneId = useExplorationStore((state) => state.currentZoneId)
  const discoveries = useExplorationStore((state) => state.discoveries)
  const zone = zones.find((item) => item.id === zoneId)

  return (
    <section className="hud" aria-label="Interfaz de exploración">
      <div className="hud__card">
        <p className="hud__eyebrow">Registro de campo</p>
        <h1 className="hud__title">{zone?.name ?? 'Zona sin catalogar'}</h1>
        <p className="hud__meta">
          {zone?.mood}<br />
          Hallazgos registrados: {discoveries.length}
        </p>
      </div>

      <div className="hud__card">
        <p className="hud__eyebrow">Controles de prototipo</p>
        <p className="hud__meta">
          WASD mover · mouse mirar · E interactuar · M mapa
        </p>
      </div>
    </section>
  )
}
