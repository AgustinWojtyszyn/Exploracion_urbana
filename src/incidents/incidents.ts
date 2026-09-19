export type Incident = {
  id: string; time: string; apartment: string
  type: 'ascensor' | 'agua' | 'luz'
  description: string; status: 'pendiente' | 'en revisión' | 'derivado'
  priority: 'normal' | 'alta'; steps?: string[]; consequences: string[]; supernaturalEvent?: 'floor17'
}
export const initialIncidents: Incident[] = [
  { id: '024', time: '01:54', apartment: '6 B', type: 'ascensor', description: 'El B quedó detenido. Se escucha el motor, pero no baja.', status: 'pendiente', priority: 'alta', steps: ['Revisar CCTV', 'Probar llamada en PB', 'Verificar indicador'], consequences: ['Mantener B fuera de servicio'], supernaturalEvent: 'floor17' },
  { id: '023', time: '01:32', apartment: 'PB', type: 'agua', description: 'Humedad junto a la puerta de bombas. Revisar al relevo.', status: 'derivado', priority: 'normal', consequences: ['Avisar a mantenimiento'] },
  { id: '022', time: '00:46', apartment: '3 A', type: 'luz', description: 'El tubo de la escalera tarda en encender.', status: 'pendiente', priority: 'normal', consequences: ['Reponer tubo en turno mañana'] },
]
