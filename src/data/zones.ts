export type Zone = {
  id: string
  name: string
  layer: 'surface' | 'transport' | 'service' | 'below'
  mood: string
  landmark: string
}

export const zones: Zone[] = [
  {
    id: 'linea-cero-anden',
    name: 'Andén Línea Cero',
    layer: 'transport',
    mood: 'Último servicio, humedad, tubos fluorescentes y eco distante.',
    landmark: 'Mosaico municipal tapado por capas de afiches.',
  },
  {
    id: 'galeria-san-jorge',
    name: 'Galería San Jorge',
    layer: 'service',
    mood: 'Locales tapiados, persianas bajas, motores eléctricos todavía activos.',
    landmark: 'Ascensor de carga sin botonera.',
  },
  {
    id: 'mantenimiento', name: 'Pasillo de mantenimiento', layer: 'service',
    mood: 'Cañerías que vibran detrás del revoque.', landmark: 'Una franja verde continúa hacia el oeste.',
  },
  {
    id: 'sector-tecnico', name: 'Sector técnico', layer: 'service',
    mood: 'Un circuito sigue trabajando después del último tren.', landmark: 'Tablero de alimentación inferior.',
  },
  {
    id: 'nodo-14',
    name: 'Nodo 14',
    layer: 'below',
    mood: 'Infraestructura imposible debajo de infraestructura real.',
    landmark: 'Plano ferroviario con una estación que no existe en superficie.',
  },
]
