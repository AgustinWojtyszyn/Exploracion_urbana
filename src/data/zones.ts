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
    id: 'nodo-14',
    name: 'Nodo 14',
    layer: 'below',
    mood: 'Infraestructura imposible debajo de infraestructura real.',
    landmark: 'Plano ferroviario con una estación que no existe en superficie.',
  },
]
