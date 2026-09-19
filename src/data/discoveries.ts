import type { Discovery } from '../systems/explorationStore'

export const evidence: Record<string, Omit<Discovery, 'discoveredAt'>> = {
  plan: {
    id: 'plan', title: 'Plano ferroviario incompleto', kind: 'infrastructure', zoneId: 'linea-cero-anden',
    note: 'El plano corta el andén en sección. Bajo la cota 0 hay una línea punteada: «Servicio 14 / cota −6». El destino fue raspado. No parece una vía de superficie.',
  },
  numbers: {
    id: 'numbers', title: 'Numeración repetida', kind: 'signal', zoneId: 'galeria-san-jorge',
    note: '14 en el pilar del andén. 14 otra vez detrás de la galería, con la misma plantilla y un trazo debajo. Dos sectores separados. ¿Una misma instalación?',
  },
  power: {
    id: 'power', title: 'Tablero eléctrico', kind: 'infrastructure', zoneId: 'sector-tecnico',
    note: 'El circuito 14 sigue consumiendo. La etiqueta dice «Alimentación inferior / enclavamiento manual». La galería usa el 08; boletería, el 03. El zumbido continúa detrás de la compuerta.',
  },
}
export const requiredEvidence = ['plan', 'numbers', 'power']
